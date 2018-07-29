<template>
    <Card>
        <div class="margin-bottom-10">
            <Button type="primary" icon="plus" @click="showModalAddskill">Добавить</Button>
        </div>
        <modal name="add-skill" height="250px" width="200px">
            <div class="modal">
                <label>Изображение скилла</label>
                <div class="wrapper-img-skill">
                    <img id="newSkillImg" :src="skill.img" alt="" class="skill-img" @click="setImg"/>
                </div>
                <label>Название скилла</label>
                <Input v-model="skill.title" placeholder="Название скилла" class="margin-bottom-10"></Input>
                <Button type="primary" long @click="addskill">Добавить</Button>
            </div>
        </modal>
        <Table border :columns="columns" :data="skills"></Table>

        <modal name="edit-skill" height="250px" width="200px">
            <div class="modal">
                <label>Изображение скилла</label>
                <div class="wrapper-img-skill">
                    <img id="editSkillImg" :src="editskill.img" class="skill-img" alt="" @click="updateImg"/>
                </div>
                <label>Название скилла</label>
                <Input v-model="editskill.title" placeholder="Название скилла" class="margin-bottom-10"></Input>
                <Button type="primary" long @click="updateskill(editskill.id)">Обновить</Button>
            </div>
        </modal>
    </Card>
</template>

<script>
    export default {
        name: 'skills',
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
                        title: 'Название скилла',
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
                                            this.deleteskill(params.row.id)
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
                                            this.getskill(params.row.id)
                                        }
                                    }
                                }, 'Редактировать   ')
                            ]);
                        }
                    }
                ],
                skills: [],
                skill: {
                    img: "../assets/images/logo.jpg"
                },
                editskill: {},
            }
        },
        created: function () {
            this.getSkills()
        },
        methods: {
            setImg() {
                var lfm = function (options, cb) {
                    var route_prefix = (options && options.prefix) ? options.prefix : '/laravel-filemanager';
                    window.open(route_prefix + '?type=' + options.type || 'file');
                    window.SetUrl = cb;
                };
                lfm({type: 'image', prefix: '/laravel-filemanager'}, function (url, path) {
                    document.getElementById("newSkillImg").src = path;

                });
            },

            updateImg() {
                var lfm = function (options, cb) {
                    var route_prefix = (options && options.prefix) ? options.prefix : '/laravel-filemanager';
                    window.open(route_prefix + '?type=' + options.type || 'file');
                    window.SetUrl = cb;
                };
                lfm({type: 'image', prefix: '/laravel-filemanager'}, function (url, path) {
                    document.getElementById("editSkillImg").src = path;

                });
            },

            getSkills() {
                this.axios.get('/api/skills').then((response) => {
                    //console.log(response);
                    this.skills = response.data.data;
                });
            },
            addskill() {
                this.skill.img = document.getElementById("newSkillImg").src;
                //console.log(this.skill);

                this.axios.post('/api/skills', this.skill).then((response) => {
                    //console.log(response.data);
                    if (response.data == 0) {
                        this.$Notice.warning({
                            title: 'Внимание!',
                            desc: 'Уже есть скилл с таким названием!'
                        });
                    }
                    else {
                        this.$Notice.success({
                            title: 'Успешно сохранено',
                            desc: 'Добавлен новый скилл'
                        });
                        this.skill.title = '';
                        this.skill.title = '';
                    }
                    this.getSkills();
                });
                this.$modal.hide('add-skill');
            },
            deleteskill(id) {
                this.axios.delete('/api/skills/' + id).then((response) => {
                    this.getSkills();
                });
            },
            showModalAddskill() {
                this.$modal.show('add-skill');
            },
            clearForm() {
                this.skill.title = '';
                this.$modal.hide('add-skill');
            },
            getskill(id) {
                this.axios.get('/api/skills/' + id + '/edit').then((response) => {
                    //console.log(response);
                    this.editskill = response.data.data;
                });
                this.$modal.show('edit-skill');
            },
            updateskill(id) {
                this.editskill.img = document.getElementById("editSkillImg").src;

                this.axios.patch('/api/skills/' + id, this.editskill).then((response) => {
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
                        this.editskill.title = '';
                        this.$modal.hide('edit-skill');
                    }
                    this.getSkills();

                });
            },
            clearEditForm() {
                this.editskill.title = '';
                this.$modal.hide('edit-skill');
            },
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