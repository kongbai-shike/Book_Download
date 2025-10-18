// 静态数据文件 - 更新版本
const sampleBooks = [
    {
        id: 1,
        title: '三体',
        author: '刘慈欣',
        cover: 'https://via.placeholder.com/150x200?text=三体',
        publisher: '重庆出版社',
        publishDate: '2008-01-01',
        description: '《三体》是刘慈欣创作的系列长篇科幻小说，讲述了地球人类文明和三体文明的信息交流、生死搏杀及两个文明在宇宙中的兴衰历程。',
        downloadLinks: [
            { name: 'PDF格式', url: 'sample-files/三体-示例章节.pdf', type: 'pdf' },
            { name: 'EPUB格式', url: 'sample-files/三体-示例章节.epub', type: 'epub' },
            { name: 'MOBI格式', url: 'sample-files/三体-示例章节.mobi', type: 'mobi' }
        ]
    },
    {
        id: 2,
        title: '百年孤独',
        author: '加西亚·马尔克斯',
        cover: 'https://via.placeholder.com/150x200?text=百年孤独',
        publisher: '南海出版公司',
        publishDate: '2011-06-01',
        description: '《百年孤独》是哥伦比亚作家加西亚·马尔克斯创作的长篇小说，是魔幻现实主义的代表作，描写了布恩迪亚家族七代人的传奇故事。',
        downloadLinks: [
            { name: 'PDF格式', url: 'sample-files/百年孤独-示例章节.pdf', type: 'pdf' },
            { name: 'EPUB格式', url: 'sample-files/百年孤独-示例章节.epub', type: 'epub' }
        ]
    }
];

// 默认书源 - 基于QQ浏览器书源的实用版本
const defaultSources = [
    {
        name: 'QQ浏览器书源',
        url: 'https://novel.html5.qq.com',
        type: 'json', // 新增类型标识
        searchUrl: 'https://so.html5.qq.com/ajax/real/search_result?tabId=360&q={key}',
        detailUrl: 'https://novel.html5.qq.com/qbread/api/novel/bookInfo?resourceId={bookId}',
        chaptersUrl: 'https://novel.html5.qq.com/qbread/api/book/all-chapter?bookId={bookId}',
        contentUrl: 'https://novel.html5.qq.com/be-api/content/ads-read',
        
        // 搜索规则
        searchList: 'data.state',
        searchTitle: 'title',
        searchAuthor: 'author',
        searchCover: 'cover_url',
        searchBookId: 'groupID',
        
        // 详情规则
        bookTitle: 'resourceName',
        bookAuthor: 'author',
        bookCover: 'picurl',
        bookDescription: 'summary',
        bookPublisher: 'publisher',
        
        // 请求头
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; U; Android 13; zh-cn; V2183A Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/89.0.4389.72 MQQBrowser/13.4 Mobile Safari/537.36 COVC/046223',
            'Referer': 'https://novel.html5.qq.com',
            'Q-GUID': '0ee63838b72eb075f63e93ae0bc288cb',
            'QIMEI36': '8ff310843a87a71101958f5610001e316a11'
        },
        valid: true
    },
    {
        name: '示例HTML书源',
        url: 'https://www.example.com',
        type: 'html',
        searchUrl: '/search?q={key}',
        searchList: '.book-item',
        searchTitle: '.title',
        searchAuthor: '.author',
        searchCover: '.cover img',
        searchDetailUrl: 'a',
        valid: true
    }
];