import { SQLite } from 'expo';

export default class Database {
  constructor() {
    this.db = SQLite.openDatabase('voiceNotesDb');
  }

  executeSql(sql, params) {
    return new Promise(resolve => {
      this.db.transaction(
        tx => {
          tx.executeSql(sql, params, (_, result) => {
            resolve(result.rows._array);
          });
        },
        null,
        null
      );
    });
  }

  async init() {
    await this.executeSql('create table if not exists voiceNotes (id integer primary key not null, title text, audioFile text, category text);')
  }

  async getNotes() {
    const result = await this.executeSql(
      'select * from voiceNotes;'
    );
    return result;
  }

  async getNote(id) {
    const result = await this.executeSql(
      'select * from voiceNotes where id=?;',
      [id]
    );
    return result;
  }

  async createNote(note) {
    const result = await this.executeSql(
      'insert into voiceNotes (title, audioFile, category) values (?, ?, ?);',
      [note.title, note.audioFile, note.category]
    );
    return result;
  }

  async updateNote(note) {
    const result = await this.executeSql(
      'update voiceNotes set title = ?, category = ? where id = ?;',
      [note.title, note.category, note.id]
    );
    return result;
  }

  async deleteNote(id) {
    const result = await this.executeSql(
      'delete from voiceNotes where id=?;',
      [id]
    );
    return result;
  }
}