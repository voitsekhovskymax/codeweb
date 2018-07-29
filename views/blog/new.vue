<style lang="less">
    @import '../../styles/common.less';
    #articleImg {
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
                        <img id="articleImg" :src="article.img" alt="" @click="setImg"/>
                    </FormItem>

                    <FormItem label="Заголовок">
                        <Input v-model="article.title" @on-blur="handleArticletitleBlur" icon="android-list"/>
                    </FormItem>
                    <FormItem v-show="showLink" label="Ссылка">
                        <Input v-model="article.url">
                        <span slot="prepend">{{ fixedLink }}</span>
                        <span slot="append"><Icon type="link" size="22"></Icon></span>
                        </Input>
                    </FormItem>
                    <FormItem label="Описание статьи ">
                        <Input v-model="article.description" type="textarea" :rows="4"
                               placeholder="Описание статьи (максимум 256 символов)"
                               @on-change="handleArticleDescriptionBlur"></Input>
                    </FormItem>
                </Form>
                <div class="margin-top-20">
                    <textarea id="articleEditor"></textarea>
                </div>
            </Card>
            </Col>
            <Col span="6" class="padding-left-10">
            <Card class="collapse_card">
                <p slot="title">
                    <Icon type="ios-pricetags-outline"></Icon>
                    SEO
                </p>
                <Collapse v-model="Collapse_" accordion>
                    <Panel name="1">
                        Ключевые слова
                        <p slot="content">
                            <Input v-model="article.seo_keywords" type="textarea" :rows="4"
                                   placeholder="SEO ключевые слова статьи"></Input>
                        </p>
                    </Panel>
                    <Panel name="2">
                        Заголовок
                        <p slot="content">
                            <Input v-model="article.seo_title" type="textarea" :rows="4"
                                   placeholder="SEO название статьи"></Input>
                        </p>
                    </Panel>
                    <Panel name="3">
                        Описание
                        <p slot="content">
                            <Input v-model="article.seo_description" type="textarea" :rows="4"
                                   placeholder="SEO описание статьи"></Input>
                        </p>
                    </Panel>
                </Collapse>
            </Card>
            <div class="margin-top-10">
                <Card>
                    <p slot="title">
                        <Icon type="navicon-round"></Icon>
                        Категория
                    </p>
                    <Row>
                        <Col span="24" class="margin-top-10">
                        <CheckboxGroup v-model="article.categories"  class="list-wrapper">
                            <p v-for="item in categories" v-if="item.type === 'article'"
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
                        <Icon type="ios-pricetags-outline"></Icon>
                        Теги
                    </p>
                    <Row>
                        <Col span="24">
                        <CheckboxGroup v-model="article.tags"  class="list-wrapper">
                            <p v-for="item in tags" 
                               :key="item.title">
                                <Checkbox :label="item.title">{{ item.title }}</Checkbox>
                            </p>
                        </CheckboxGroup>
                        </Col>
                        <Col span="24" class="margin-top-10">
                        <Button  @click="showModalAddTag" icon="plus"  shape="circle" type="ghost"></Button>
                        </Col>
                    </Row>
                    <modal name="add-tag" height="130px" width="200px">
                        <div class="modal">
                            <label>Название тега</label>
                            <Input v-model="tag.title" placeholder="Название тега" class="margin-bottom-10"></Input>
                            <Button type="primary" long @click="addTag">Добавить</Button>
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
        name: 'blog_new',
        data() {
            return {
                article: {
                    title: "",
                    url: "",
                    description: "",
                    content: "",
                    author_id: null,
                    categories: null,
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
                categories: [],
                tags:[],
                categoriesTypeList: [
                    {title: 'Портфолио', value: 'portfolio'},
                    {title: 'Блог', value: 'article'}
                ],
                category: {
                    type: 'article'
                },
                tag:{}
            };
        },
        methods: {
            addTag() {
                this.tag.type = "article";
                this.axios.post('/api/tags', this.tag).then((response) => {
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
            showModalAddTag() {
                this.$modal.show('add-tag');
            },
            showModalAddcategory() {
                this.$modal.show('add-category');
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
            setImg() {
                var lfm = function (options, cb) {
                    var route_prefix = (options && options.prefix) ? options.prefix : '/laravel-filemanager';
                    window.open(route_prefix + '?type=' + options.type || 'file');
                    window.SetUrl = cb;
                };
                lfm({type: 'image', prefix: '/laravel-filemanager'}, function (url, path) {
                    document.getElementById("articleImg").src = path;
                });
            },
            getTags() {
                this.axios.get('/api/tags').then((response) => {
                    //console.log(response);
                    this.tags = response.data.data;
                });
            },
            getCategories() {
                this.axios.get('/api/categories').then((response) => {
                    console.log(response);
                    this.categories = response.data.data;
                });
            },
            handleArticletitleBlur() {
                if (this.article.title.length !== 0) {
                    this.article.url = this.translit(this.article.title);
                    this.article.seo_title = this.article.title;
                    this.showLink = true;
                } else {
                    this.$Message.error('Заголовок  не может быть пустым');
                }
            },
            handleArticleDescriptionBlur() {
                if (this.article.description.length !== 0) {
                    this.article.seo_description = this.article.description;
                } else {
                    this.$Message.error('Описание не может быть пустым');
                }
            },
            canPublish() {
                if (this.article.title.length === 0) {
                    this.$Message.error('Пустой заголовок!');
                    return false;
                } else {
                    return true;
                }
            },
            handlePublish() {
                if (this.canPublish()) {
                    this.article.img = document.getElementById("articleImg").src;
                    this.article.content = tinymce.get('articleEditor').getContent();
                    console.log(this.article);
                    this.axios.post('/api/posts', this.article).then((response) => {
                        console.log(response.data);
                        if (response.data == 0) {
                            this.$Notice.warning({
                                title: 'Внимание!',
                                desc: 'Уже есть пост с таким названием!'
                            });
                        }
                        else {
                            this.$Notice.success({
                                title: 'Успешно!',
                                desc: 'Пост 《' + this.article.title + '》успешно опубликован!'
                            });
                        }
                    });
                }
            },
            handleAddNewCategory() {
                this.addingNewCategory = !this.addingNewCategory;
            },
            createNewCategory() {
                if (this.newCategoryName.length !== 0) {
                    this.categories.push({value: this.newCategoryName});
                    this.addingNewCategory = false;
                    setTimeout(() => {
                        this.newCategoryName = '';
                    }, 200);
                } else {
                    this.$Message.error('请输入标签名');
                }
            },
            cancelCreateNewCategory() {
                this.newCategoryName = '';
                this.addingNewCategory = false;
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
            this.fixedLink = window.location.host + '/blog/';
            this.getTags();
            this.getCategories();
            tinyMCE.baseURL = "/tinymce";
            tinymce.init({
                selector: '#articleEditor',
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
                content_css : '/assets/css/tinymce_fix.css',
                relative_urls: false,
                image_advtab: true,
                table_default_styles: {
                    width: '100%',
                    borderCollapse: 'collapse'
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
        },
        destroyed() {
            tinymce.get('articleEditor').destroy();
        }
    };
</script>
