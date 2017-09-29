const Vue = require('nativescript-vue');

const ContactForm = {
    props: {
        contact: {
            default() {
                return { name: '', phone: '', recent: false, favorite: false }
            }
        },
        isNew: Boolean
    },
    template: `
      <stack-layout width="90%" style="background-color: #fff;">
        <stack-layout style="height: 150; background-color: #00aafc;">
          <label :text="isNew ? 'Add Contact' : 'Edit Contact'" class="tab-title" style="margin-top: 80;"></label>
        </stack-layout>
    
        <label text="Name" style="margin: 10; font-size: 12;"></label>
        <text-field v-model="_contact.name" hint="Contact Name"></text-field>
      
        <label text="Phone" style="margin: 10; font-size: 12;"></label>
        <text-field v-model="_contact.phone" hint="Contact Phone"></text-field>
    
        <grid-layout columns="*, *" height="40">
          <button col="0" text="Cancel" @tap="cancel"></button>
          <button col="1" text="Save" @tap="save"></button>
        </grid-layout>
      </stack-layout>
    `,

    created() {
        this._contact = Object.assign({}, this.$props.contact)
    },

    data() {
        return {
            _contact: {},
        };
    },

    methods: {
        save() {
            this.$modal.close(this._contact);
        },
        cancel() {
            this.$modal.close();
        },
    }
};

const app = new Vue({
    template: `
    <page>
      <action-bar title="I 😍 NativeScript-Vue">
        <action-item android.systemIcon="ic_menu_add" @tap="showForm()"></action-item>
      </action-bar>
      <stack-layout>
          <tab-view>
              <tab-view-item v-for="tab in tabs" :title="tab.title">
              <stack-layout>
                  <stack-layout height="100"
                              :backgroundColor="tab.bgColor">
              
                      <label :text="tab.title" class="tab-title"></label>
              
                  </stack-layout>
                  <!-- Will add something cool here -->
                  <list-view :items="s(tab.listSource)" @itemTap="openContact">
                      <template scope="contact">
                          <stack-layout class="contact-list-item">
              
                              <label :text="contact.name" 
                                      class="contact-name"></label>
              
                              <label :text="contact.phone"
                                      class="contact-phone"></label>
              
                          </stack-layout>
                      </template>
                  </list-view>
              </stack-layout>
              </tab-view-item>
          </tab-view>
      </stack-layout>
    </page>  
  `,

    data: {
        tabs: [
            {
                title: 'Recent',
                listSource: 'recentContacts',
                bgColor: '#00aafc'
            },
            {
                title: 'All',
                listSource: 'contacts',
                bgColor: '#3d5afe'
            },
            {
                title: 'Favorites',
                listSource: 'favoriteContacts',
                bgColor: '#ff4081'
            },
        ],

        contacts: [
            { name: 'John Doe', phone: '123 456 789', recent: true, favorite: true },
            { name: 'Jane Doe', phone: '123 456 789', recent: false, favorite: true },
            { name: 'Alice', phone: '123 456 789', recent: true, favorite: false },
            { name: 'Bob', phone: '123 456 789', recent: false, favorite: false },
        ],
    },

    computed: {
        recentContacts() {
            return this.contacts.filter(c => c.recent);
        },
        favoriteContacts() {
            return this.contacts.filter(c => c.favorite);
        }
    },

    methods: {
        s(source) {
            return this[source];
        },
        openContact(e) {
            const contact = e.item;
            let vm = this

            this.$showModal({
                template: `
          <stack-layout width="90%" height="40%"
                        style="background-color: #fff;">
            <stack-layout style="height: 150; background-color: #00aafc;">
              <label text="${contact.name}" class="tab-title"
                     style="margin-top: 80;"></label>
            </stack-layout>
                  
            <label text="Phone" style="margin: 10; font-size: 12;"></label>
            <label text="${contact.phone}" style="margin-left: 20;"></label>

            <button text="Edit" @tap="edit" style="margin-top: 10"></button>
          </stack-layout>
        `,

                methods: {
                    edit() {
                        this.$modal.close();
                        vm.showForm(contact);
                    }
                }
            })
        },
        showForm(contact) {
            const isNew = !contact;
            const options = {
                context: {
                    propsData: {
                        contact: contact,
                        isNew: isNew,
                    }
                }
            };

            this.$showModal(ContactForm, options).then((res) => {
                if (res) {
                    if (isNew) {
                        this.contacts.push(res);
                    } else {
                        // update existing contact
                        for (const prop in res) {
                            contact[prop] = res[prop]
                        }
                    }
                }
            });
        }
    }
});

app.$start();