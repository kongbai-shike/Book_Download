// Vue主应用 - 完整修复版本
new Vue({
    el: '#app',
    data: {
        isLoggedIn: false,
        username: '',
        showLoginModal: false,
        showRegisterModal: false,
        loginForm: {
            username: '',
            password: ''
        },
        registerForm: {
            username: '',
            password: '',
            confirmPassword: ''
        },
        searchType: 'title',
        searchKeyword: '',
        searchResults: [],
        selectedBook: null,
        recommendedBooks: [],
        downloadHistory: [],
        bookManager: new BookSourceManager(),
        bookSources: [],
        currentSourceName: '',
        loading: false
    },
    computed: {
        todayDownloads() {
            const today = new Date().toDateString();
            return this.downloadHistory.filter(item => 
                new Date(item.timestamp).toDateString() === today
            ).length;
        },
        totalDownloads() {
            return this.downloadHistory.length;
        }
    },
    created() {
        // 从本地存储加载下载历史
        const savedHistory = localStorage.getItem('downloadHistory');
        if (savedHistory) {
            this.downloadHistory = JSON.parse(savedHistory);
        }
        
        // 加载默认书源
        this.loadDefaultSources();
        
        // 加载推荐书籍
        this.loadRecommendations();
    },
    methods: {
        // 加载默认书源
        loadDefaultSources() {
            defaultSources.forEach(source => {
                this.bookManager.addSource(source);
            });
            
            this.bookSources = this.bookManager.getSources();
            
            // 设置默认书源
            if (this.bookSources.length > 0) {
                this.currentSourceName = this.bookSources[0].name;
                this.bookManager.setCurrentSource(this.currentSourceName);
            }
        },
        
        // 加载推荐书籍
        async loadRecommendations() {
            // 使用当前书源加载推荐书籍
            if (!this.currentSourceName) return;
            
            try {
                this.loading = true;
                const results = await this.bookManager.search('热门');
                this.recommendedBooks = results.slice(0, 5); // 取前5本作为推荐
            } catch (error) {
                console.error('加载推荐书籍失败:', error);
                // 使用备用推荐数据
                this.recommendedBooks = sampleBooks;
            } finally {
                this.loading = false;
            }
        },
        
        // 选择书源
        selectSource(sourceName) {
            this.currentSourceName = sourceName;
            this.bookManager.setCurrentSource(sourceName);
            this.loadRecommendations();
        },
        
        // 导入书源
        importSource(event) {
            if (event && event.target && event.target.files) {
                this.handleFileUpload(event);
            } else {
                document.getElementById('sourceFile').click();
            }
        },
        
        // 处理文件上传
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const sources = JSON.parse(e.target.result);
                    if (Array.isArray(sources)) {
                        sources.forEach(source => {
                            this.bookManager.addSource(source);
                        });
                        this.bookSources = this.bookManager.getSources();
                        alert(`成功导入 ${sources.length} 个书源`);
                    } else {
                        alert('书源文件格式不正确');
                    }
                } catch (error) {
                    alert('解析书源文件失败: ' + error.message);
                }
            };
            reader.readAsText(file);
            
            // 重置文件输入
            event.target.value = '';
        },
        
        // 验证书源
        async validateSources() {
            this.loading = true;
            
            for (let source of this.bookSources) {
                await this.bookManager.validateSource(source);
            }
            
            this.bookSources = [...this.bookManager.getSources()];
            this.loading = false;
            alert('书源验证完成');
        },
        
       // 搜索书籍 - 修复版本
        async search() {
            console.log('搜索关键词:', this.searchKeyword);
            
            if (!this.searchKeyword || !this.searchKeyword.trim()) {
                // 如果搜索关键词为空，显示推荐书籍
                this.searchResults = [];
                this.selectedBook = null;
                return;
            }
            
            if (!this.currentSourceName) {
                alert('请先选择书源');
                return;
            }
            
            try {
                this.loading = true;
                this.searchResults = await this.bookManager.search(this.searchKeyword.trim(), this.searchType);
                this.selectedBook = null;
                
                if (this.searchResults.length === 0) {
                    alert('未找到相关书籍');
                }
            } catch (error) {
                console.error('搜索错误:', error);
                alert('搜索失败: ' + error.message);
            } finally {
                this.loading = false;
            }
        },
        
        // 选择书籍
        async selectBook(book) {
            try {
                this.loading = true;
                this.selectedBook = await this.bookManager.getBookDetail(book);
                this.searchResults = [];
            } catch (error) {
                console.error('获取书籍详情失败:', error);
                this.selectedBook = book;
            } finally {
                this.loading = false;
            }
        },
        
        // 下载书籍
        downloadBook(link) {
            if (this.isLoggedIn) {
                // 创建隐藏的下载链接
                const a = document.createElement('a');
                a.href = link.url;
                a.download = this.getDownloadFilename(link);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                // 记录下载历史
                this.trackDownload(link);
                
                alert(`开始下载: ${this.selectedBook.title} - ${link.name}`);
            } else {
                alert('请先登录');
            }
        },
        
        getDownloadFilename(link) {
            // 根据书籍和格式生成文件名
            const book = this.selectedBook;
            const ext = link.type || link.url.split('.').pop();
            return `${book.title}_${book.author}.${ext}`;
        },
        
        trackDownload(link) {
            // 记录下载统计
            const downloadRecord = {
                username: this.username,
                book: this.selectedBook.title,
                format: link.type,
                timestamp: new Date().toISOString()
            };
            
            this.downloadHistory.push(downloadRecord);
            localStorage.setItem('downloadHistory', JSON.stringify(this.downloadHistory));
            
            console.log(`用户 ${this.username} 下载了: ${link.url}`);
        },
        
        // 处理图片加载错误
        handleImageError(event) {
            event.target.style.display = 'none';
        },
        
        // 登录和注册方法
        login(credentials) {
            if (credentials.username && credentials.password) {
                this.isLoggedIn = true;
                this.username = credentials.username;
                this.showLoginModal = false;
                alert('登录成功！');
            } else {
                alert('请输入用户名和密码');
            }
        },
        
        register(credentials) {
            if (credentials.username && credentials.password) {
                if (credentials.password !== credentials.confirmPassword) {
                    alert('两次输入的密码不一致');
                    return;
                }
                this.isLoggedIn = true;
                this.username = credentials.username;
                this.showRegisterModal = false;
                alert('注册成功！');
            } else {
                alert('请输入完整的注册信息');
            }
        },
        
        logout() {
            this.isLoggedIn = false;
            this.username = '';
            this.selectedBook = null;
            this.searchResults = [];
            alert('已退出登录');
        }
    }
});