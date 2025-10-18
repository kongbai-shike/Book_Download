// 横幅组件
Vue.component('banner-section', {
    props: ['isLoggedIn', 'username'],
    template: `
        <div class="banner">
            <h1>精品图书下载站</h1>
            <p>海量资源，一键下载，畅享阅读乐趣</p>
            <div class="auth-buttons" v-if="!isLoggedIn">
                <button class="btn btn-login" @click="$emit('show-login')">登录</button>
                <button class="btn btn-register" @click="$emit('show-register')">注册</button>
            </div>
            <div class="auth-buttons" v-else>
                <span>欢迎，{{ username }}！</span>
                <button class="btn btn-register" @click="$emit('logout')">退出登录</button>
            </div>
        </div>
    `
});

// 推荐榜组件
Vue.component('recommendations-section', {
    props: ['books', 'selectedBook'],
    template: `
        <div class="recommendations">
            <h2>热门推荐</h2>
            <ul class="book-list">
                <li 
                    v-for="(book, index) in books" 
                    :key="book.id"
                    class="book-item"
                    :class="{ active: selectedBook && selectedBook.id === book.id }"
                    @click="$emit('select-book', book)"
                >
                    <span class="book-rank">{{ index + 1 }}</span>
                    <div class="book-info">
                        <div class="book-title">{{ book.title }}</div>
                        <div class="book-author">{{ book.author }}</div>
                    </div>
                </li>
            </ul>
        </div>
    `
});

// 搜索组件
Vue.component('search-section', {
    props: ['searchType', 'searchKeyword'],
    template: `
        <div class="search-section">
            <div class="search-box">
                <select class="search-select" :value="searchType" @change="$emit('update:searchType', $event.target.value)">
                    <option value="title">小说名</option>
                    <option value="comic">漫画名</option>
                    <option value="book">书籍名</option>
                    <option value="author">作者名</option>
                </select>
                <input 
                    type="text" 
                    class="search-input" 
                    placeholder="请输入搜索内容"
                    :value="searchKeyword"
                    @input="$emit('update:searchKeyword', $event.target.value)"
                    @keyup.enter="$emit('search')"
                >
                <button class="search-button" @click="$emit('search')">搜索</button>
            </div>
            <div class="search-tips">
                提示：登录后可以下载图书资源
            </div>
        </div>
    `
});

// 详情区域组件
Vue.component('details-section', {
    props: ['isLoggedIn', 'selectedBook', 'searchResults'],
    template: `
        <div class="details-section">
            <!-- 搜索结果 -->
            <div v-if="searchResults.length > 0">
                <h3>搜索结果 ({{ searchResults.length }})</h3>
                <ul class="search-results">
                    <li 
                        v-for="book in searchResults" 
                        :key="book.id"
                        class="search-result-item"
                        @click="$emit('select-book', book)"
                    >
                        <img :src="book.cover" :alt="book.title" class="result-cover">
                        <div class="result-info">
                            <div class="result-title">{{ book.title }}</div>
                            <div class="result-author">{{ book.author }}</div>
                        </div>
                    </li>
                </ul>
            </div>
            
            <!-- 书籍详情 -->
            <div v-else-if="selectedBook">
                <div class="book-details">
                    <img :src="selectedBook.cover" :alt="selectedBook.title" class="book-cover">
                    <div class="book-meta">
                        <h2>{{ selectedBook.title }}</h2>
                        <p><strong>作者：</strong>{{ selectedBook.author }}</p>
                        <p><strong>出版社：</strong>{{ selectedBook.publisher }}</p>
                        <p><strong>出版日期：</strong>{{ selectedBook.publishDate }}</p>
                        <p><strong>简介：</strong>{{ selectedBook.description }}</p>
                    </div>
                </div>
                <div class="download-section">
                    <h3>下载资源</h3>
                    <ul class="download-links">
                        <li 
                            v-for="(link, index) in selectedBook.downloadLinks" 
                            :key="index"
                            class="download-link"
                        >
                            <span>{{ link.name }}</span>
                            <button 
                                class="download-btn" 
                                :disabled="!isLoggedIn"
                                @click="$emit('download-book', link.url)"
                            >
                                {{ isLoggedIn ? '下载' : '请先登录' }}
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            
            <!-- 空白状态 -->
            <div v-else class="empty-state">
                <i>📚</i>
                <p>请选择一本书籍查看详情</p>
            </div>
        </div>
    `
});

// 登录模态框组件
Vue.component('login-modal', {
    data() {
        return {
            username: '',
            password: ''
        }
    },
    template: `
        <div class="login-modal">
            <div class="modal-content">
                <h2>用户登录</h2>
                <div class="form-group">
                    <label for="username">用户名</label>
                    <input type="text" id="username" v-model="username">
                </div>
                <div class="form-group">
                    <label for="password">密码</label>
                    <input type="password" id="password" v-model="password">
                </div>
                <div class="modal-buttons">
                    <button class="btn btn-cancel" @click="$emit('close')">取消</button>
                    <button class="btn btn-confirm" @click="handleLogin">登录</button>
                </div>
            </div>
        </div>
    `,
    methods: {
        handleLogin() {
            this.$emit('login', {
                username: this.username,
                password: this.password
            });
            this.username = '';
            this.password = '';
        }
    }
});

// 注册模态框组件
Vue.component('register-modal', {
    data() {
        return {
            username: '',
            password: '',
            confirmPassword: ''
        }
    },
    template: `
        <div class="login-modal">
            <div class="modal-content">
                <h2>用户注册</h2>
                <div class="form-group">
                    <label for="reg-username">用户名</label>
                    <input type="text" id="reg-username" v-model="username">
                </div>
                <div class="form-group">
                    <label for="reg-password">密码</label>
                    <input type="password" id="reg-password" v-model="password">
                </div>
                <div class="form-group">
                    <label for="confirm-password">确认密码</label>
                    <input type="password" id="confirm-password" v-model="confirmPassword">
                </div>
                <div class="modal-buttons">
                    <button class="btn btn-cancel" @click="$emit('close')">取消</button>
                    <button class="btn btn-confirm" @click="handleRegister">注册</button>
                </div>
            </div>
        </div>
    `,
    methods: {
        handleRegister() {
            this.$emit('register', {
                username: this.username,
                password: this.password,
                confirmPassword: this.confirmPassword
            });
            this.username = '';
            this.password = '';
            this.confirmPassword = '';
        }
    }
});