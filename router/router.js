import Main from '../views/Main.vue';


export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: 'Страница не найдена'
    },
    component: resolve => {
        require(['../views/error-page/404.vue'], resolve);
    }
};

export const page403 = {
    path: '/403',
    meta: {
        title: 'Доступ запрещен'
    },
    name: 'error-403',
    component: resolve => {
        require(['../views/error-page/403.vue'], resolve);
    }
};

export const page500 = {
    path: '/500',
    meta: {
        title: 'Ошибка сервера'
    },
    name: 'error-500',
    component: resolve => {
        require(['../views/error-page/500.vue'], resolve);
    }
};

export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        {
            path: 'home',
            title: 'Главная',
            name: 'home_index',
            component: resolve => {
                require(['../views/pages/home.vue'], resolve);
            }
        },
        {
            path: '/portfolio/edit/:id',
            title: 'Редактирование портфолио',
            name: 'portfolio_edit',
            component: resolve => {
                require(['../views/portfolio/edit.vue'], resolve);
            }
        },
        {
            path: 'blog/edit/:id',
            title: 'Редактирование поста',
            name: 'blog_edit',
            component: resolve => {
                require(['../views/blog/edit.vue'], resolve);
            }
        }
    ]
};

export const appRouter = [
    {
        path: '/blog',
        icon: 'social-buffer',
        name: 'blog',
        title: 'Блог',
        component: Main,
        children: [
            {
                path: 'all',
                title: 'Все посты блога',
                name: 'blog_all',
                component: resolve => {
                    require(['../views/blog/all.vue'], resolve);
                }
            },
            {
                path: 'new',
                title: 'Новый пост в блоге',
                name: 'blog_new',
                component: resolve => {
                    require(['../views/blog/new.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/portfolio',
        icon: 'social-buffer',
        name: 'portfolio',
        title: 'Портфолио',
        component: Main,
        children: [
            {
                path: 'all',
                title: 'Все портфолио',
                name: 'portfolio_all',
                component: resolve => {
                    require(['../views/portfolio/all.vue'], resolve);
                }
            },
            {
                path: 'new',
                title: 'Новое портфолио',
                name: 'portfolio_new',
                component: resolve => {
                    require(['../views/portfolio/new.vue'], resolve);
                }
            }
        ]
    },
    {
        path: '/other',
        icon: 'social-buffer',
        name: 'other',
        title: 'Другое',
        component: Main,
        children: [
            {
                path: 'categories',
                title: 'Категории',
                name: 'categories',
                component: resolve => {
                    require(['../views/other/categories.vue'], resolve);
                }
            },
            {
                path: 'skills',
                title: 'Скиллы',
                name: 'skills',
                component: resolve => {
                    require(['../views/other/skills.vue'], resolve);
                }
            },
            {
                path: 'tags',
                title: 'Теги',
                name: 'tags',
                component: resolve => {
                    require(['../views/other/tags.vue'], resolve);
                }
            }
        ]
    }

];

export const routers = [
    otherRouter,
    ...appRouter,
    page500,
    page403,
    page404
];
