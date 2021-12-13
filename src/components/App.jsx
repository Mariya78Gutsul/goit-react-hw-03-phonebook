import React, { Component } from "react";
import { nanoid } from "nanoid";
import ContactList from "./ContactList/ContactList";
import Filter from "./Filter/Filter";
import ContactForm from "./ContactForm/ContactForm";
import * as storage from "./LocalStorage/LocalStorage";

const STORAGE_KEY = "contacts";

export default class App extends Component {
  state = {
    contacts: [
      { id: "id-1", name: "Rosie Simpson", number: "459-12-56" },
      { id: "id-2", name: "Hermione Kline", number: "443-89-12" },
      { id: "id-3", name: "Eden Clements", number: "645-17-79" },
      { id: "id-4", name: "Annie Copeland", number: "227-91-26" },
    ],
    filter: "",
  };

  componentDidMount() {
    const savedContacts = storage.get(STORAGE_KEY);
    if (savedContacts) {
      this.setState({ contacts: savedContacts });
    }
  }
  componentDidUpdate(prevState) {
    const newContact = this.state.contacts;
    const prevContact = prevState.contacts;

    if (newContact?.length !== prevContact?.length)
      storage.save(STORAGE_KEY, newContact);
  }

  addContact = (task) => {
    const searchSameName = this.state.contacts
      .map((cont) => cont.name.toLowerCase())
      .includes(task.name.toLowerCase());

    if (searchSameName) {
      alert(`${task.name} is already in contacts`);
    } else if (task.name.length === 0) {
      alert("Fields must be filled!");
    } else {
      const contact = {
        ...task,
        id: nanoid(),
      };

      this.setState((prevState) => ({
        contacts: [...prevState.contacts, contact],
      }));
    }
  };

  changeFilter = (e) => {
    this.setState({ filter: e.currentTarget.value });
  };

  getVisibleContacts = () => {
    const { contacts, filter } = this.state;

    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );
  };

  removeContact = (id) => {
    this.setState((prevState) => ({
      contacts: prevState.contacts.filter((contact) => contact.id !== id),
    }));
  };

  render() {
    const filteredContacts = this.getVisibleContacts();
    const { addContact, changeFilter, removeContact } = this;
    return (
      <div>
        <h1>Phonebook</h1>
        <ContactForm onAddContact={addContact} />
        <h2>Contacts</h2>

        <Filter filter={this.state.filter} onChangeFilter={changeFilter} />
        <ContactList
          contacts={filteredContacts}
          onRemoveContact={removeContact}
        />
      </div>
    );
  }
}
