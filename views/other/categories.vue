<template>
    <Card>
        <div>
            <Button type="primary" icon="plus" @click="showModalAddcategory">Добавить</Button>
            <modal name="add-category"
                   height="200px" :scrollable="true" width="200px">
                <div style="padding:15px;">
                    <label>Добавить категорию в:</label>
                    <Select v-model="category.type"
                            class="margin-bottom-10"
                            placeholder="Тип категории">
                        <Option v-for="item in categoriesTypeList" :value="item.value" :key="item.value">
                            <span>{{item.title}}</span>
                        </Option>
                    </Select>
                    <label>Название категории</label>
                    <Input v-model="category.title" class="margin-bottom-10" placeholder="Название категории"></Input>
                    <Button type="primary" long @click="addcategory">Добавить</Button>
                </div>
            </modal>
        </div>
        <br>
        <Table border :columns="columns" :data="categories"></Table>

        <modal name="edit-category" height="200px" width="200px">
            <div style="padding:15px;">
                <label>Тип категории:</label>
                {{editCategory.type}}
                <Select v-model="editCategory.type"
                        class="margin-bottom-10"
                        placeholder="Тип категории">
                    <Option v-for="item in categoriesTypeList" :value="item.value" :key="item.value">
                        <span>{{item.title}}</span>
                    </Option>
                </Select>
                <label>Название категории</label>
                <Input v-model="editCategory.title" class="margin-bottom-10" placeholder="Название категории"></Input>
                <br>
                <Button type="primary" long @click="updatecategory(editCategory.id)">Обновить</Button>
                </Row>
            </div>
        </modal>
    </Card>
</template>

<script>
    export default {
        name: 'categories',
        data() {
            return {
                columns: [
                    {
                        title: 'Название категории',
                        key: 'title'
                    },
                    {
                        title: 'URL',
                        key: 'url'
                    },
                    {
                        title: 'Тип',
                        key: 'type'
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
                                            this.deletecategory(params.row.id)
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
                                            this.getcategory(params.row.id)
                                        }
                                    }
                                }, 'Редактировать   ')
                            ]);
                        }
                    }
                ],
                categories: [],
                category: {
                    type: 'article'
                },
                editCategory: {},
            }
        },
        created: function () {
            this.getCategories();

            this.categoriesTypeList = [
                {title: 'Портфолио', value: 'portfolio'},
                {title: 'Блог', value: 'article'}
            ]
        },
        methods: {
            getCategories() {
                this.axios.get('/api/categories').then((response) => {
                    this.categories = response.data.data;
                });
            },
            addcategory() {
                this.axios.post('/api/categories', this.category).then((response) => {
                    if (response.data == 0) {
                        this.$Notice.warning({
                            title: 'Внимание!',
                            desc: 'Уже есть категория с таким названием!'
                        });
                    }
                    else {
                        this.$Notice.success({
                            title: 'Успешно сохранено',
                            desc: 'Добавлена новая категория'
                        });
                        this.category.title = '';
                    }
                    this.getCategories();
                });
                this.$modal.hide('add-category');
            },
            deletecategory(id) {
                this.axios.delete('/api/categories/' + id).then((response) => {
                    this.getCategories();
                });
            },
            showModalAddcategory() {
                this.$modal.show('add-category');
            },
            getcategory(id) {
                this.axios.get('/api/categories/' + id + '/edit').then((response) => {
                    this.editCategory = response.data.category;
                });
                this.$modal.show('edit-category');
            },
            updatecategory(id) {
                this.axios.patch('/api/categories/' + id, this.editCategory).then((response) => {
                    if (response.data == 0) {
                        this.$Notice.warning({
                            title: 'Внимание!',
                            desc: 'Уже есть категория с таким названием!'
                        });
                    }
                    else {
                        this.$Notice.success({
                            title: 'Успешно обновлено',
                            desc: 'Обновлен категория'
                        });
                        this.editCategory.title = '';
                        this.$modal.hide('edit-category');
                    }
                    this.getCategories();
                });
            }
        }
    }
</script>

<style>


</style>