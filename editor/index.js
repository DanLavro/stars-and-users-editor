const usersInitial = [
  { id: '1', name: 'Vasia', phone: '+123456789' },
  { id: '2', name: 'Jhon', phone: '+987654321' },
  { id: '3', name: 'Vova', phone: '+987654323' },
  { id: '4', name: 'Peter', phone: '+987654322' },
];

const phonePattern = '\\+[\\d-]+';

function createElement(tag, attributes) {
  return Object.assign(document.createElement(tag), attributes);
}

class UsersModel {
  constructor(callback, serverCallback = () => {}, users) {
    this.users = users;
    this.callback = callback;
    this.serverCallback = serverCallback;
    this.saveAll = () => {
      this.callback();
      this.serverCallback(this.users);
    };
  }
  getUserIndex(id) {
    return this.users.findIndex((innerUser) => id === innerUser.id);
  }
  deleteUser(id) {
    this.users.splice(this.getUserIndex(id), 1);
    this.saveAll();
  }
  addUser(user) {
    this.users.push(user);
    this.saveAll();
  }
  editUser(user) {
    this.users[this.getUserIndex(user.id)] = user;
    this.saveAll();
  }
}

class UsersView {
  constructor(container, users) {
    this.container = container;
    this.model = new UsersModel(
      this.render.bind(this),
      (users) => {
        //send data via fetch to server
        console.log('AAAAAAAAAAAAAA Sending data to server', users);
      },
      users
    );

    if (container.childNodes.length === 0) {
      this.table = this.initialCreateTable();
      this.form = this.initialForm();
      container.append(this.table, this.form);
    } else {
      throw new Error('Container is not empty');
    }

    this.render();

    this.actions = {
      delete: (event) => {
        const { id } = event.target.dataset;
        this.model.deleteUser(id);
      },
      add: (name, phone) => {
        const user = {
          id: Math.random().toString(16).slice(2),
          name: name,
          phone: phone,
        };

        this.model.addUser(user);
      },
      edit: (user) => {
        this.model.editUser(user);
      },
      toggleEditMode: (id, event) => {
        const userRow = this.table.querySelector(`#user${id}`);
        userRow.querySelector(`.Input-Name`).classList.toggle('hidden');
        userRow.querySelector(` .Name`).classList.toggle('hidden');

        userRow.querySelector(`.Input-Phone`).classList.toggle('hidden');
        userRow.querySelector(`.Phone`).classList.toggle('hidden');

        userRow.querySelector(`.Save-Buttons`).classList.toggle('hidden');
        userRow.querySelector(` .Edit-Buttons`).classList.toggle('hidden');
      },
    };

    this.container.addEventListener('click', (event) => {
      const { action } = event.target.dataset;

      if (action in this.actions) {
        this.actions[action](event);
      }
    });
  }

  initialCreateTable(nameLabel = 'Full Name', phoneLabel = 'Telephone number') {
    const table = createElement('table');
    const tableHead = createElement('thead');

    const nameTh = createElement('th', { innerText: nameLabel });
    const TelephoneTh = createElement('th', {
      innerText: phoneLabel,
    });

    tableHead.append(nameTh, TelephoneTh, createElement('th'));
    table.append(tableHead);

    const tableBody = createElement('tbody');
    table.append(tableBody);

    container.append(table);
    return table;
  }

  initialForm(nameLabel = 'Full Name', phoneLabel = 'Telephone number') {
    const form = createElement('form', {});
    form.classList.add('Main-Form');

    const labelName = createElement('label', { innerText: nameLabel });
    const labelPhone = createElement('label', { innerText: phoneLabel });

    const inputName = createElement('input', {
      id: 'name',
      required: 'true',
    });
    const inputNumber = createElement('input', {
      id: 'phone',
      type: 'tel',
      pattern: phonePattern,
      required: 'true',
    });

    const button = createElement('button', {
      innerText: 'Добавить',
      type: 'submit',
    });

    form.append(labelName, inputName, labelPhone, inputNumber, button);
    form.addEventListener('submit', (submitEvent) => {
      submitEvent.preventDefault();

      const nameElement = this.form.name;
      const phoneElement = this.form.phone;

      this.actions.add(nameElement.value, phoneElement.value);
    });
    return form;
  }

  render() {
    const createTableRow = (user) => {
      return `<tr id="user${user.id}">
      <td>
        <input class='Input-Name hidden' type="text" required value="${user.name}">
        <span class='Name'>${user.name}<span>
      </td>
      <td>
        <input class='Input-Phone hidden' pattern="${phonePattern}" type="tel" required value="${user.phone}">
        <span class='Phone'>${user.phone}<span></td>
      <td>
        <div class='Edit-Buttons'>
          <button class='Edit'>Редактировать</button>
          <button data-action="delete" data-id="${user.id}">Стереть</button>
        </div>
        <div class='Save-Buttons hidden'>
          <button class='Save'>Сохранить</button>
          <span class='Error'><span>
        </div>
      </td>
      </tr>`;
    };

    let tableContent = '';
    for (const user of this.model.users) {
      tableContent += createTableRow(user);
    }
    this.table.lastChild.innerHTML = tableContent;

    for (const user of this.model.users) {
      const currentRow = this.table.querySelector(`#user${user.id}`);

      currentRow.querySelector(`.Edit`).addEventListener('click', (event) => {
        this.actions.toggleEditMode(user.id, event);
      });

      currentRow.querySelector('.Input-Name').addEventListener('input', () => {
        currentRow.querySelector('.Error').innerHTML = '';
      });
      currentRow.querySelector('.Input-Phone').addEventListener('input', () => {
        currentRow.querySelector('.Error').innerHTML = '';
      });

      currentRow.querySelector(`.Save`).addEventListener('click', (event) => {
        if (
          currentRow.querySelector('.Input-Name').checkValidity() &&
          currentRow.querySelector('.Input-Phone').checkValidity()
        ) {
          this.actions.toggleEditMode(user.id, event);
          this.actions.edit({
            id: user.id,
            name: currentRow.querySelector('.Input-Name').value,
            phone: currentRow.querySelector('.Input-Phone').value,
          });
        } else {
          //todo show error
          currentRow.querySelector('.Error').innerHTML =
            currentRow.querySelector('.Input-Name').validationMessage +
            ' ' +
            currentRow.querySelector('.Input-Phone').validationMessage;
        }
      });
    }
  }
}

const container = document.getElementById('container');
const usersView = new UsersView(container, usersInitial);
