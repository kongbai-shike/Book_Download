// 模拟数据
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
            { name: 'PDF格式', url: '/download/1.pdf' },
            { name: 'EPUB格式', url: '/download/1.epub' },
            { name: 'MOBI格式', url: '/download/1.mobi' }
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
            { name: 'PDF格式', url: '/download/2.pdf' },
            { name: 'EPUB格式', url: '/download/2.epub' }
        ]
    },
    {
        id: 3,
        title: '活着',
        author: '余华',
        cover: 'https://via.placeholder.com/150x200?text=活着',
        publisher: '作家出版社',
        publishDate: '2012-08-01',
        description: '《活着》是作家余华的代表作之一，讲述了在大时代背景下，随着内战、三反五反、大跃进、文化大革命等社会变革，徐福贵的人生和家庭不断经受着苦难。',
        downloadLinks: [
            { name: 'PDF格式', url: '/download/3.pdf' },
            { name: 'EPUB格式', url: '/download/3.epub' },
            { name: 'TXT格式', url: '/download/3.txt' }
        ]
    },
    {
        id: 4,
        title: '围城',
        author: '钱钟书',
        cover: 'https://via.placeholder.com/150x200?text=围城',
        publisher: '人民文学出版社',
        publishDate: '1991-02-01',
        description: '《围城》是钱钟书所著的长篇小说，是中国现代文学史上一部风格独特的讽刺小说，被誉为"新儒林外史"。',
        downloadLinks: [
            { name: 'PDF格式', url: '/download/4.pdf' },
            { name: 'EPUB格式', url: '/download/4.epub' }
        ]
    },
    {
        id: 5,
        title: '平凡的世界',
        author: '路遥',
        cover: 'https://via.placeholder.com/150x200?text=平凡的世界',
        publisher: '北京十月文艺出版社',
        publishDate: '2005-01-01',
        description: '《平凡的世界》是中国作家路遥创作的一部百万字的小说，全景式地表现中国当代城乡社会生活。',
        downloadLinks: [
            { name: 'PDF格式', url: '/download/5.pdf' },
            { name: 'EPUB格式', url: '/download/5.epub' },
            { name: 'MOBI格式', url: '/download/5.mobi' }
        ]
    }
];