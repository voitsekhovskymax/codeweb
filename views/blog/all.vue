<template>
    <Card>
        <Table border :columns="columns" :data="articles"></Table>
    </Card>
</template>

<script>
    export default {
        name: 'blog_all',
        data() {
            return {
                columns: [
                    {
                        title: 'Изображение',
                        key: 'img',
                        render: (h, params) => {
                            return h('img', {
                                attrs: {
                                    src: params.row.img,
                                },
                                style: {
                                    display: 'inline-block',
                                    width: '75px',
                                    height: '75px',
                                    borderRadius: '75px',
                                    border: '1px solid gray',
                                    margin: '5px',
                                    objectFit: 'cover'
                                },
                            })
                        }
                    },
                    {
                        title: 'Название ',
                        key: 'title'
                    },
                    {
                        title: 'URL',
                        key: 'url'
                    },
                    {
                        title: 'Действие',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteArticle(params.row.id)
                                        }
                                    }
                                }, 'Удалить')
                            ]);
                        }
                    }, {
                        title: 'Редактировать',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.getArticle(params.row.id)
                                        }
                                    }
                                }, 'Редактировать   ')
                            ]);
                        }
                    }
                ],
                articles: []
            }
        },
        created: function () {
            this.getArticles();
        },
        methods: {
            getArticles() {
                this.axios.get('/api/posts').then((response) => {
                    this.articles = response.data.data;
                });
            },
            deleteArticle(id) {
                this.axios.delete('/api/posts/' + id).then((response) => {
                    this.getArticles();
                });
            },
            getArticle(article_id) {
                this.$router.push({
                    name: 'blog_edit',
                    params: {
                        id: article_id
                    }
                });
            }
        }
    }
</script>

<style>


</style>