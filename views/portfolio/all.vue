<template>
    <Card>
        <Table border :columns="columns" :data="portfolios"></Table>
    </Card>
</template>

<script>
    export default {
        name: 'portfolios',
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
                                    borderRadius:'75px',
                                    border:'1px solid gray',
                                    margin:'5px',
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
                                            this.deletePortfolio(params.row.id)
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
                                            this.getPortfolio(params.row.id)
                                        }
                                    }
                                }, 'Редактировать   ')
                            ]);
                        }
                    }
                ],
                portfolios: []
            }
        },
        created: function () {
            this.getPortfolios()
        },
        methods: {
            getPortfolios() {
                this.axios.get('/api/portfolios').then((response) => {
                    //console.log(response);
                    this.portfolios = response.data.data;
                });
            },
            deletePortfolio(id) {
                this.axios.delete('/api/portfolios/' + id).then((response) => {
                    this.getPortfolios();
                });
            },
            getPortfolio(portfolio_id) {
                this.$router.push({
                    name: 'portfolio_edit',
                    params: {
                        id: portfolio_id
                    }
                });
            }
        }
    }
</script>

<style scope>

    .skill-img {
        width: 70px;
        height: 70px;
        object-fit: cover;
        border-radius: 150px;
    }

</style>