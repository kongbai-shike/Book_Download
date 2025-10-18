// 书源管理器类 - 增强版本，支持JSON API
class BookSourceManager {
    constructor() {
        this.sources = [];
        this.currentSource = null;
    }
    
    // 添加书源
    addSource(source) {
        // 验证书源格式
        if (!this.validateSourceFormat(source)) {
            console.error('书源格式不正确:', source);
            return false;
        }
        
        source.valid = true;
        // 设置默认类型
        if (!source.type) {
            source.type = 'html';
        }
        this.sources.push(source);
        return true;
    }
    
    // 验证书源格式
    validateSourceFormat(source) {
        return source && 
               source.name && 
               source.url && 
               source.searchUrl;
    }
    
    // 设置当前书源
    setCurrentSource(sourceName) {
        this.currentSource = this.sources.find(s => s.name === sourceName);
    }
    
    // 获取当前书源
    getCurrentSource() {
        return this.currentSource;
    }
    
    // 搜索书籍 - 支持JSON和HTML
    async search(keyword, searchType = 'title') {
        if (!this.currentSource) {
            throw new Error('请先设置书源');
        }
        
        const source = this.currentSource;
        
        // 构建搜索URL
        let searchUrl;
        if (source.searchUrl.includes('{key}')) {
            searchUrl = source.searchUrl.replace('{key}', encodeURIComponent(keyword));
        } else {
            searchUrl = source.searchUrl + encodeURIComponent(keyword);
        }
        
        // 确保URL完整
        if (!searchUrl.startsWith('http')) {
            searchUrl = source.url + (searchUrl.startsWith('/') ? '' : '/') + searchUrl;
        }
        
        try {
            const options = {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    ...source.headers
                }
            };
            
            // 使用CORS代理解决跨域问题
            const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(searchUrl);
            const response = await fetch(proxyUrl, options);
            const data = await response.json();
            
            // 解析返回的内容
            const content = data.contents;
            
            if (source.type === 'json') {
                return this.parseJSONSearchResults(content, source, keyword);
            } else {
                return this.parseHTMLSearchResults(content, source, keyword);
            }
        } catch (error) {
            console.error('搜索失败:', error);
            // 返回示例数据作为备用
            return this.getFallbackResults(keyword);
        }
    }
    
    // 解析JSON搜索结果
    parseJSONSearchResults(content, source, keyword) {
        try {
            const data = JSON.parse(content);
            const bookElements = this.getNestedValue(data, source.searchList);
            const books = [];
            
            if (bookElements && Array.isArray(bookElements)) {
                bookElements.forEach((element, index) => {
                    try {
                        const title = this.getNestedValue(element, source.searchTitle);
                        const author = this.getNestedValue(element, source.searchAuthor) || '未知作者';
                        let cover = this.getNestedValue(element, source.searchCover);
                        const bookId = this.getNestedValue(element, source.searchBookId);
                        
                        // 处理bookId，移除后缀
                        let cleanBookId = bookId;
                        if (bookId && typeof bookId === 'string') {
                            cleanBookId = bookId.replace(/_.*$/, '');
                        }
                        
                        if (title) {
                            books.push({
                                id: `${source.name}-${index}-${Date.now()}`,
                                title: title,
                                author: author,
                                cover: cover,
                                bookId: cleanBookId,
                                source: source.name,
                                type: 'json'
                            });
                        }
                    } catch (error) {
                        console.error('解析书籍信息失败:', error);
                    }
                });
            }
            
            return books;
        } catch (error) {
            console.error('解析JSON失败:', error);
            return this.getFallbackResults(keyword);
        }
    }
    
    // 解析HTML搜索结果
    parseHTMLSearchResults(html, source, keyword) {
        // 创建虚拟DOM
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // 使用书源规则解析
        const bookElements = doc.querySelectorAll(source.searchList || '.book-item');
        const books = [];
        
        bookElements.forEach((element, index) => {
            try {
                const titleEl = element.querySelector(source.searchTitle || '.title');
                const authorEl = element.querySelector(source.searchAuthor || '.author');
                const coverEl = element.querySelector(source.searchCover || '.cover img');
                const detailUrlEl = element.querySelector(source.searchDetailUrl || 'a');
                
                if (titleEl) {
                    const title = titleEl.textContent.trim();
                    const author = authorEl ? authorEl.textContent.trim() : '未知作者';
                    let cover = null;
                    
                    if (coverEl) {
                        cover = coverEl.getAttribute('src');
                        if (cover && !cover.startsWith('http')) {
                            cover = new URL(cover, source.url).href;
                        }
                    }
                    
                    let detailUrl = null;
                    if (detailUrlEl) {
                        detailUrl = detailUrlEl.getAttribute('href');
                        if (detailUrl && !detailUrl.startsWith('http')) {
                            detailUrl = new URL(detailUrl, source.url).href;
                        }
                    }
                    
                    books.push({
                        id: `${source.name}-${index}`,
                        title,
                        author,
                        cover,
                        detailUrl,
                        source: source.name,
                        type: 'html'
                    });
                }
            } catch (error) {
                console.error('解析书籍信息失败:', error);
            }
        });
        
        return books;
    }
    
    // 获取嵌套值
    getNestedValue(obj, path) {
        if (!path) return undefined;
        
        const keys = path.split('.');
        let result = obj;
        
        for (const key of keys) {
            if (result && typeof result === 'object' && key in result) {
                result = result[key];
            } else {
                return undefined;
            }
        }
        
        return result;
    }
    
    // 备用搜索结果
    getFallbackResults(keyword) {
        console.log('使用备用搜索结果');
        return sampleBooks.filter(book => 
            book.title.includes(keyword) || 
            book.author.includes(keyword)
        ).map(book => ({
            ...book,
            source: '本地示例',
            type: 'html'
        }));
    }
    
    // 获取书籍详情
    async getBookDetail(book) {
        // 如果是示例数据，直接返回
        if (book.downloadLinks) {
            return book;
        }
        
        if (!this.currentSource) {
            throw new Error('请先设置书源');
        }
        
        const source = this.currentSource;
        
        try {
            if (source.type === 'json' && book.bookId) {
                return await this.getJSONBookDetail(book, source);
            } else if (book.detailUrl) {
                return await this.getHTMLBookDetail(book, source);
            } else {
                return book; // 返回基本信息
            }
        } catch (error) {
            console.error('获取书籍详情失败:', error);
            return this.getFallbackBookDetail(book);
        }
    }
    
    // 获取JSON书籍详情
    async getJSONBookDetail(book, source) {
        const detailUrl = source.detailUrl.replace('{bookId}', book.bookId);
        const fullUrl = detailUrl.startsWith('http') ? detailUrl : source.url + detailUrl;
        
        const options = {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                ...source.headers
            }
        };
        
        const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(fullUrl);
        const response = await fetch(proxyUrl, options);
        const data = await response.json();
        const content = JSON.parse(data.contents);
        
        // 更新书籍信息
        if (source.bookTitle) book.title = this.getNestedValue(content, source.bookTitle) || book.title;
        if (source.bookAuthor) book.author = this.getNestedValue(content, source.bookAuthor) || book.author;
        if (source.bookCover) book.cover = this.getNestedValue(content, source.bookCover) || book.cover;
        if (source.bookDescription) book.description = this.getNestedValue(content, source.bookDescription);
        if (source.bookPublisher) book.publisher = this.getNestedValue(content, source.bookPublisher);
        
        // 添加下载链接（模拟）
        book.downloadLinks = this.generateDownloadLinks(book);
        
        return book;
    }
    
    // 获取HTML书籍详情
    async getHTMLBookDetail(book, source) {
        const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(book.detailUrl);
        const response = await fetch(proxyUrl);
        const data = await response.json();
        const html = data.contents;
        
        return this.parseHTMLBookDetail(html, source, book);
    }
    
    // 解析HTML书籍详情
    parseHTMLBookDetail(html, source, book) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // 使用书源规则解析详情
        const titleEl = doc.querySelector(source.bookTitle || '.book-title');
        const authorEl = doc.querySelector(source.bookAuthor || '.book-author');
        const coverEl = doc.querySelector(source.bookCover || '.book-cover img');
        const descriptionEl = doc.querySelector(source.bookDescription || '.description');
        const publisherEl = doc.querySelector(source.bookPublisher || '.publisher');
        
        // 更新书籍信息
        if (titleEl) book.title = titleEl.textContent.trim();
        if (authorEl) book.author = authorEl.textContent.trim();
        if (coverEl) {
            let cover = coverEl.getAttribute('src');
            if (cover && !cover.startsWith('http')) {
                cover = new URL(cover, source.url).href;
            }
            book.cover = cover;
        }
        if (descriptionEl) book.description = descriptionEl.textContent.trim();
        if (publisherEl) book.publisher = publisherEl.textContent.trim();
        
        // 添加下载链接
        book.downloadLinks = this.generateDownloadLinks(book);
        
        return book;
    }
    
    // 生成下载链接
    generateDownloadLinks(book) {
        return [
            { name: 'PDF格式', url: `#${book.id}-pdf`, type: 'pdf' },
            { name: 'EPUB格式', url: `#${book.id}-epub`, type: 'epub' },
            { name: 'TXT格式', url: `#${book.id}-txt`, type: 'txt' }
        ];
    }
    
    // 备用书籍详情
    getFallbackBookDetail(book) {
        const sampleBook = sampleBooks.find(b => b.title === book.title) || sampleBooks[0];
        return {
            ...book,
            ...sampleBook,
            downloadLinks: this.generateDownloadLinks(book)
        };
    }
    
    // 验证书源有效性
    async validateSource(source) {
        try {
            // 测试搜索功能
            const tempCurrent = this.currentSource;
            this.currentSource = source;
            const results = await this.search('测试');
            this.currentSource = tempCurrent;
            
            source.valid = results.length > 0;
            return source.valid;
        } catch (error) {
            source.valid = false;
            return false;
        }
    }
    
    // 获取所有书源
    getSources() {
        return this.sources;
    }
}