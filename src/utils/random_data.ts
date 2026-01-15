export const RandomData = {
    names: ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Frank'],
    surnames: ['Doe', 'Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Evans'],
    domains: ['example.com', 'test.com', 'demo.org', 'site.net'],

    getName() {
        return this.names[Math.floor(Math.random() * this.names.length)];
    },

    getSurname() {
        return this.surnames[Math.floor(Math.random() * this.surnames.length)];
    },

    getFullName() {
        return `${this.getName()} ${this.getSurname()}`;
    },

    getEmail(name?: string) {
        const n = name || this.getName();
        const d = this.domains[Math.floor(Math.random() * this.domains.length)];
        return `${n.toLowerCase()}.${Math.floor(Math.random() * 1000)}@${d}`;
    },

    getPhone() {
        return `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
    },

    getString(length = 8) {
        return Math.random().toString(36).substring(2, 2 + length);
    },

    getNumber() {
        return Math.floor(Math.random() * 10000).toString();
    }
}
