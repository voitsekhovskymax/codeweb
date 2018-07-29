<style lang="less" scoped>
    @import '../../styles/common.less';

    .skill-img {
        width: 50px;
        height: 50px;
        border-radius: 50px;
        border: 1px solid gray;
        object-fit: cover;
    }

    #portfolioImg {
        width: 100%;
        height: 200px;
        border: 1px solid #c5c5c5;
        object-fit: cover;
        cursor: pointer;
    }

</style>

<template>
    <div>
        <Row>
            <Col span="18">
            <Card>
                <Form :label-width="80">
                    <FormItem label="Изображение">
                        <img id="portfolioImg" :src="portfolio.img" alt="" @click="setImg"/>
                    </FormItem>
                    <FormItem label="Заголовок">
                        <Input v-model="portfolio.title" @on-blur="handleportfoliotitleBlur" icon="android-list"
                               placeholder="Заголовок портфолио"/>
                    </FormItem>
                    <FormItem v-show="showLink" label="Ссылка">
                        <Input v-model="portfolio.url">
                        <span slot="prepend">{{ fixedLink }}</span>
                        <span slot="append"><Icon type="link" size="22"></Icon></span>
                        </Input>
                    </FormItem>
                    <FormItem label="Описание статьи ">
                        <Input v-model="portfolio.description" type="textarea" :rows="4"
                               placeholder="Описание статьи (максимум 256 символов)"
                               @on-change="handleportfolioDescriptionBlur"></Input>
                    </FormItem>
                </Form>
                <div class="margin-top-20">
                    <textarea id="portfolioEditor"></textarea>
                </div>
            </Card>
            </Col>
            <Col span="6" class="padding-left-10">
            <Card>
                <p slot="title">
                    <Icon type="navicon-round"></Icon>
                    Скиллы
                </p>
                <Row>
                    <Col span="24" class="margin-top-10">
                    <CheckboxGroup v-model="portfolio.skills" class="list-wrapper">
                        <p v-for="item in skills" :key="item.title">
                            <Checkbox :label="item.title">
                                <span>
                                    <img :src="item.img" alt="" class="skill-img">
                                </span>
                                {{ item.title }}
                            </Checkbox>
                        </p>
                    </CheckboxGroup>
                    </Col>
                    <Col span="24" class="margin-top-10">
                    <Button @click="showModalAddskill" icon="plus" shape="circle" type="ghost"></Button>
                    </Col>
                </Row>
                <modal name="add-skill" height="250px" width="200px">
                    <div class="modal">
                        <label>Изображение скилла</label>
                        <div class="wrapper-img-skill">
                            <img id="newSkillImg" :src="skill.img" alt="" class="skill-img" @click="setSkillImg"/>
                        </div>
                        <label>Название скилла</label>
                        <Input v-model="skill.title" placeholder="Название скилла" class="margin-bottom-10"></Input>
                        <Button type="primary" long @click="addskill">Добавить</Button>
                    </div>
                </modal>

            </Card>


            <div class="margin-top-10">
                <Card class="collapse_card">
                    <p slot="title">
                        <Icon type="ios-pricetags-outline"></Icon>
                        SEO
                    </p>
                    <Collapse v-model="Collapse_" accordion>
                        <Panel name="1">
                            Ключевые слова
                            <p slot="content">
                                <Input v-model="portfolio.seo_keywords" type="textarea" :rows="4"
                                       placeholder="SEO ключевые слова портфолио"></Input>
                            </p>
                        </Panel>
                        <Panel name="2">
                            Заголовок
                            <p slot="content">
                                <Input v-model="portfolio.seo_title" type="textarea" :rows="4"
                                       placeholder="SEO название портфолио"></Input>
                            </p>
                        </Panel>
                        <Panel name="3">
                            Описание
                            <p slot="content">
                                <Input v-model="portfolio.seo_description" type="textarea" :rows="4"
                                       placeholder="SEO описание портфолио"></Input>
                            </p>
                        </Panel>
                    </Collapse>
                </Card>
            </div>
            <div class="margin-top-10">
                <Card>
                    <p slot="title">
                        <Icon type="navicon-round"></Icon>
                        Категория
                    </p>
                    <Row>
                        <Col span="24" class="margin-top-10">
                        <CheckboxGroup v-model="portfolio.categories" class="list-wrapper">
                            <p v-for="item in categories" v-if="item.type === 'portfolio'"
                               :key="item.title">
                                <Checkbox :label="item.title">{{ item.title }}</Checkbox>
                            </p>
                        </CheckboxGroup>
                        </Col>
                        <Col span="24" class="margin-top-10">
                        <Button @click="showModalAddcategory" icon="plus" shape="circle"
                                type="ghost"></Button>
                        </Col>
                    </Row>
                    <modal name="add-category" height="200px" width="200px">
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
                            <Input v-model="category.title" class="margin-bottom-10"
                                   placeholder="Название категории"></Input>
                            <Button type="primary" long @click="addcategory">Добавить</Button>
                        </div>
                    </modal>
                </Card>
            </div>

            <div class="margin-top-10">
                <Card>
                    <p slot="title">
                        <Icon type="paper-airplane"></Icon>
                        Публикация
                    </p>
                    <Row class="margin-top-20 publish-button-con">
                    <span class="publish-button">
                        <Button @click="handlePublish" :loading="publishLoading" icon="ios-checkmark" type="primary">Опубликовать</Button>
                    </span>
                    </Row>
                </Card>
            </div>
            </Col>
        </Row>
    </div>
</template>

<script>
    import tinymce from 'tinymce';

    export default {
        name: 'portfolio_new',
        data() {
            return {
                portfolio: {
                    title: "",
                    url: "",
                    description: "",
                    content: "",
                    author_id: null,
                    skills: [],
                    categories: [],
                    tags: null,
                    seo_title: "",
                    seo_keywords: "",
                    seo_description: "",
                    img: "../assets/images/admin/blog.jpg",
                    lang: 'ru'
                },
                showLink: false,
                fixedLink: '',
                Collapse_: '1',
                publishLoading: false,
                skills: [],
                skill: {
                    img: "../assets/images/logo.jpg"
                },
                categories: [],
                categoriesTypeList: [
                    {title: 'Портфолио', value: 'portfolio'},
                    {title: 'Блог', value: 'article'}
                ],
                category: {
                    type: 'article'
                },
            };
        },
        methods: {
            getPorftolio() {
                this.axios.get('/api/portfolios/' + this.$route.params.id + '/edit').then((response) => {
                    this.portfolio = response.data.data;
                    let vm = this;
                    let height = 600;
                    tinyMCE.baseURL = "/tinymce";// trailing slash important
                    tinymce.init({
                        selector: '#portfolioEditor',
                        // document_base_url: '../../tinymce/',
                        branding: false,
                        elementpath: false,
                        height: 600,
                        language: 'ru',
                        menubar: 'edit insert view format table tools',
                        theme_url: '../../tinymce/themes/modern/theme.min.js',
                        theme: 'modern',
                        plugins: [
                            'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
                            'searchreplace visualblocks visualchars code fullscreen ',
                            'insertdatetime media nonbreaking save table contextmenu directionality',
                            'emoticons paste textcolor colorpicker textpattern imagetools codesample'
                        ],
                        toolbar1: ' newnote print fullscreen preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
                        autosave_interval: '20s',
                        content_css: '/assets/css/tinymce_fix.css',
                        relative_urls : false,
                        remove_script_host : false,
                        image_advtab: true,
                        table_default_styles: {
                            width: '100%',
                            borderCollapse: 'collapse'
                        },
                        setup: function (editor) {
                            editor.on('init', function (e) {
                                vm.spinShow = false;
                                tinymce.get('portfolioEditor').setContent(vm.portfolio.content);

                            });
                        },
                        file_browser_callback: function (field_name, url, type, win) {
                            let x = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
                            let y = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
                            let cmsURL = '/laravel-filemanager?field_name=' + field_name;
                            if (type == 'image') {
                                cmsURL = cmsURL + "&type=Images";
                            } else {
                                cmsURL = cmsURL + "&type=Files";
                            }
                            tinyMCE.activeEditor.windowManager.open({
                                file: cmsURL,
                                title: 'Filemanager',
                                width: x,
                                height: y,
                                resizable: "yes",
                                close_previous: "no"
                            });
                        }
                    });
                });
            },
            getCategories() {
                this.axios.get('/api/categories').then((response) => {
                    //console.log(response);
                    this.categories = response.data.data;
                });
            },
            getSkills() {
                this.axios.get('/api/skills').then((response) => {
                    //console.log(response);
                    this.skills = response.data.data;
                });
            },
            setSkillImg() {
                var lfm = function (options, cb) {
                    var route_prefix = (options && options.prefix) ? options.prefix : '/laravel-filemanager';
                    window.open(route_prefix + '?type=' + options.type || 'file');
                    window.SetUrl = cb;
                };
                lfm({type: 'image', prefix: '/laravel-filemanager'}, function (url, path) {
                    document.getElementById("newSkillImg").src = path;

                });
            },
            setImg() {
                var lfm = function (options, cb) {
                    var route_prefix = (options && options.prefix) ? options.prefix : '/laravel-filemanager';
                    window.open(route_prefix + '?type=' + options.type || 'file');
                    window.SetUrl = cb;
                };
                lfm({type: 'image', prefix: '/laravel-filemanager'}, function (url, path) {
                    document.getElementById("portfolioImg").src = path;
                });
            },
            handleportfoliotitleBlur() {
                if (this.portfolio.title.length !== 0) {
                    this.portfolio.url = this.translit(this.portfolio.title);
                    this.portfolio.seo_title = this.portfolio.title;
                    this.showLink = true;
                } else {
                    this.$Message.error('Заголовок  не может быть пустым');
                }
            },
            handleportfolioDescriptionBlur() {
                if (this.portfolio.description.length !== 0) {
                    this.portfolio.seo_description = this.portfolio.description;
                } else {
                    this.$Message.error('Описание не может быть пустым');
                }
            },
            canPublish() {
                if (this.portfolio.title.length === 0) {
                    this.$Message.error('Пустой заголовок!');
                    return false;
                } else {
                    return true;
                }
            },
            handlePublish() {
                if (this.canPublish()) {
                    this.portfolio.img = document.getElementById("portfolioImg").src;
                    this.portfolio.content = tinymce.get('portfolioEditor').getContent();

                    //console.log(this.portfolio);
                    this.axios.patch('/api/portfolios/' + this.$route.params.id, this.portfolio).then((response) => {
                        //console.log(response.data);
                        if (response.data == 0) {
                            this.$Notice.warning({
                                title: 'Внимание!',
                                desc: 'Уже есть портфолио с таким названием!'
                            });
                        }
                        else {
                            this.$Notice.success({
                                title: 'Успешно!',
                                desc: 'Портфолио 《' + this.portfolio.title + '》успешно опубликовано!'
                            });
                        }
                    });

                }
            },
            showModalAddcategory() {
                this.$modal.show('add-category');
            },
            addcategory() {
                //console.log(this.category);
                this.axios.post('/api/categories', this.category).then((response) => {
                    //console.log(response.data);
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
            showModalAddskill() {
                this.$modal.show('add-skill');
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
            handleAddNewSkill() {
                this.$modal.show('add-skill');
            },
            cancelCreateNewSkill() {
                this.newSkillName = '';
                this.$modal.hide('add-skill');
            },
            translit(url) {
// Символ, на который будут заменяться все спецсимволы
                var space = '-';
// Берем значение из нужного поля и переводим в нижний регистр
                var text = url.toLowerCase();

// Массив для транслитерации
                var transl = {
                    'а': 'a',
                    'б': 'b',
                    'в': 'v',
                    'г': 'g',
                    'д': 'd',
                    'е': 'e',
                    'ё': 'e',
                    'ж': 'zh',
                    'з': 'z',
                    'и': 'i',
                    'й': 'j',
                    'к': 'k',
                    'л': 'l',
                    'м': 'm',
                    'н': 'n',
                    'о': 'o',
                    'п': 'p',
                    'р': 'r',
                    'с': 's',
                    'т': 't',
                    'у': 'u',
                    'ф': 'f',
                    'х': 'h',
                    'ц': 'c',
                    'ч': 'ch',
                    'ш': 'sh',
                    'щ': 'sh',
                    'ъ': space,
                    'ы': 'y',
                    'ь': space,
                    'э': 'e',
                    'ю': 'yu',
                    'я': 'ya',
                    ' ': space,
                    '_': space,
                    '`': space,
                    '~': space,
                    '!': space,
                    '@': space,
                    '#': space,
                    '$': space,
                    '%': space,
                    '^': space,
                    '&': space,
                    '*': space,
                    '(': space,
                    ')': space,
                    '-': space,
                    '\=': space,
                    '+': space,
                    '[': space,
                    ']': space,
                    '\\': space,
                    '|': space,
                    '/': space,
                    '.': space,
                    ',': space,
                    '{': space,
                    '}': space,
                    '\'': space,
                    '"': space,
                    ';': space,
                    ':': space,
                    '?': space,
                    '<': space,
                    '>': space,
                    '№': space
                }

                var result = '';
                var curent_sim = '';

                for (var i = 0; i < text.length; i++) {
                    // Если символ найден в массиве то меняем его
                    if (transl[text[i]] != undefined) {
                        if (curent_sim != transl[text[i]] || curent_sim != space) {
                            result += transl[text[i]];
                            curent_sim = transl[text[i]];
                        }
                    }
                    // Если нет, то оставляем так как есть
                    else {
                        result += text[i];
                        curent_sim = text[i];
                    }
                }
                result = this.trim(result);
                return result;
            },
            trim(s) {
                s = s.replace(/^-/, '');
                return s.replace(/-$/, '');
            }
        },
        computed: {},
        mounted() {
            this.fixedLink = window.location.host + '/portfolio/';
            this.getSkills();
            this.getCategories();
            this.getPorftolio();

        },
        destroyed() {
            tinymce.get('portfolioEditor').destroy();
        }
    };
</script>
