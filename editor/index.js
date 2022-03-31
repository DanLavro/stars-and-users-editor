const users = [
  { id: '1', name: 'Q', phone: '+123456789' },
  { id: '2', name: 'A', phone: '+987654321' },
];

// const methods = Object.getOwnPropertyNames(UsersModel.prototype);
// for (const method of methods) {
//   this[method] = function (...args) {
//     UsersModel.prototype[method].apply(this, args);
//     this.cb();
//   };
// }
// console.log(this);
class UsersModel {
  constructor(cb) {
    this.data = users;
    this.cb = cb;
  }
  deleteUser(id) {
    this.data.splice(
      this.data.findIndex((u) => u.id === id),
      1
    );
    this.cb();
  }
  addUser(user) {
    this.data.push(user);
    this.cb();
  }
  // editUser(user) {
  //   this.data[user.rowIndex - 1] = user;
  // }
}

class UsersView {
  constructor(container) {
    this.container = container;
    this.model = new UsersModel(this.render.bind(this));
    this.render();

    const actions = {
      delete: (event) => {
        const { id } = event.target.dataset;
        this.model.deleteUser(id);
      },
      add: () => {
        const nameElement = this.container.getElementById('name');
        const phoneElement = this.container.getElementById('phone');

        const user = {
          id: 3,
          name: nameElement.value,
          phone: phoneElement.value,
        };

        this.model.addUser(user);
      },
    };

    this.container.addEventListener('click', (event) => {
      const { action } = event.target.dataset;

      if (action in actions) {
        actions[action](event);
      }
    });
  }

  render() {
    let tableContent = '';

    for (const user of this.model.data) {
      tableContent += `<tr><td>${user.name}</td><td>${user.phone}</td><td><button>Редактировать</button><button data-action="delete" data-id="${user.id}">Стереть</button></td></tr>`;
    }

    document.getElementById('container').innerHTML = tableContent;
  }
}

const table = document.getElementById('usersList');
const usersView = new UsersView(table);
