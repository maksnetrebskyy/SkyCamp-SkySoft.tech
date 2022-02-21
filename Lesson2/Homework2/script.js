const createUser = function(name, age) {
    return {
        name,
        age,
        valueOf() {
            return this.age;
        },
        toString: function() {
            return `${this.name} is ${this.age}y.o.`;
        },
    }
}

const users = [
    createUser("John", 21),
    createUser("Tory", 18),
    createUser("Kate", 23),
    createUser("Pete", 22),
]

users.sort((a,b) => a - b);

console.log(users);