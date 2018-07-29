<template>
    <Card>
        <div class="margin-bottom-10">
            <Button type="primary" icon="plus" @click="showModalAddTag">Добавить</Button>
        </div>
        <modal name="add-tag" height="130px" width="200px">
            <div class="modal">
                <label>Название тега</label>
                <Input v-model="tag.title" placeholder="Название тега" class="margin-bottom-10"></Input>
                <Button type="primary" long @click="addTag">Добавить</Button>
            </div>
        </modal>
        <Table border :columns="columns" :data="tags"></Table>

        <modal name="edit-tag" height="130px" width="200px">
            <div class="modal">
                <label>Название тега</label>
                <Input v-model="editTag.title" placeholder="Название тега"  class="margin-bottom-10"></Input>
                <Button type="primary" long @click="updateTag(editTag.id)">Обновить</Button>
            </div>
        </modal>
    </Card>
</template>

<script>
    export default {
        name: 'tags',
        data() {
            return {
                columns: [
                    {
                        title: 'Название тега',
                        key: 'title'
                    },
                    {
                        title: 'URL тега',
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
                                            this.deleteTag(params.row.id)
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
                                            this.getTag(params.row.id)
                                        }
                                    }
                                }, 'Редактировать   ')
                            ]);
                        }
                    }
                ],
                tags: [],
                tag: {},
                editTag: {},
            }
        },
        created: function () {
            this.getTags()
        },
        methods: {
            getTags() {
                this.axios.get('/api/tags').then((response) => {
                    //console.log(response);
                    this.tags = response.data.data;
                });
            },
            addTag() {
                this.tag.type = "post";
                //console.log(this.tag);
                this.axios.post('/api/tags', this.tag).then((response) => {
                    //console.log(response.data);
                    if (response.data == 0) {
                        this.$Notice.warning({
                            title: 'Внимание!',
                            desc: 'Уже есть тег с таким названием!'
                        });
                    }
                    else {
                        this.$Notice.success({
                            title: 'Успешно сохранено',
                            desc: 'Добавлен новый тег'
                        });
                        this.tag.title = '';
                    }
                    this.getTags();
                });
                this.$modal.hide('add-tag');
            },
            deleteTag(id) {
                this.axios.delete('/api/tags/' + id).then((response) => {
                    this.getTags();
                });
            },
            showModalAddTag() {
                this.$modal.show('add-tag');
            },
            clearForm() {
                this.tag.title = '';
                this.$modal.hide('add-tag');
            },
            getTag(id) {
                this.axios.get('/api/tags/' + id + '/edit').then((response) => {
                    // //console.log(response);
                    this.editTag = response.data.tag;
                });
                this.$modal.show('edit-tag');
            },
            updateTag(id) {
                this.axios.patch('/api/tags/' + id, this.editTag).then((response) => {
                    if (response.data == 0) {
                        this.$Notice.warning({
                            title: 'Внимание!',
                            desc: 'Уже есть тег с таким названием!'
                        });
                    }
                    else {
                        this.$Notice.success({
                            title: 'Успешно обновлено',
                            desc: 'Обновлен тег'
                        });
                        this.editTag.title = '';
                        this.$modal.hide('edit-tag');
                    }
                    this.getTags();

                });
            },
            clearEditForm() {
                this.editTag.title = '';
                this.$modal.hide('edit-tag');
            },
        }
    }
</script>

<style>


</style>