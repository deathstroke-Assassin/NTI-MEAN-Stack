class User {
    constructor(name, password){
        this.name = name
        this.password = password
    }
    login() {
        console.log(this.name + " has logged in");
    }
    logout() {
        console.log(this.name + " has logged out");
    }
}
const user1 = new User("Ahmed", 'pass')
user1.login()
user1.logout()


// inheritance ========


class Admin extends User {
    constructor(name,password, role) {
        super(name,password)
        this.role= role
    }
    createUser(name, password) {
        console.log(`Admin ${this.name} created user ${name}`);
    }
}
const admin11 = new Admin("ALi", "pass", "Admin")

admin11.login()
admin11.createUser("ijijji","passss")
admin11.logout()
