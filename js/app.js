// Vue主应用
new Vue({
    el: '#app',
    data: {
        isLoggedIn: false,
        username: '',
        showLoginModal: false,
        showRegisterModal: false,
        searchType: 'title',
        searchKeyword: '',
        searchResults: [],
        selectedBook: null,
        recommendedBooks: sampleBooks
    },
    methods: {
        login(credentials) {
            // 模拟登录验证
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
            // 模拟注册验证
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
        },
        search() {
            if (!this.searchKeyword.trim()) {
                alert('请输入搜索关键词');
                return;
            }
            
            // 模拟搜索
            this.searchResults = this.recommendedBooks.filter(book => {
                const keyword = this.searchKeyword.toLowerCase();
                if (this.searchType === 'title') {
                    return book.title.toLowerCase().includes(keyword);
                } else if (this.searchType === 'author') {
                    return book.author.toLowerCase().includes(keyword);
                }
                return false;
            });
            
            this.selectedBook = null;
            
            if (this.searchResults.length === 0) {
                alert('未找到相关书籍');
            }
        },
        selectBook(book) {
            this.selectedBook = book;
            this.searchResults = [];
        },
        downloadBook(url) {
            if (this.isLoggedIn) {
                alert(`开始下载: ${url}`);
                // 在实际应用中，这里会触发文件下载
            } else {
                alert('请先登录');
            }
        }
    }
});