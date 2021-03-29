const contacts = [
  {
    name: "Pitter Pen 1",
    email: "piter_pen1@mail.com",
    _id: "605259cf2ab5d626e0a7413f",
    phone: "12345678",
    subscription: "free",
    password: "$2a$08$b8vpRVmjANuMgHfyNxth.epZeNhkCMS0hSLXx2g6Lwc4st303.OxO",
    owner: {
        "email": "user-for-test@mail.com"
    },
    createdAt: "2021-03-17T19:34:39.670Z",
    updatedAt: "2021-03-17T19:34:39.670Z",
  },
  {
    name: "Pitter Pen 2",
    email: "piter_pen2@mail.com",
    _id: "605259e02ab5d626e0a74140",
    phone: "12345678",
    subscription: "free",
    password: "$2a$08$VQTnU4ph7y2VfhsUrEoe7uSnpKEvwF10VHVFwUMAv0tEotY3tHEOi",
    owner: {
        "email": "user-for-test@mail.com",
    },
    createdAt: "2021-03-08T21:46:56.053Z",
    updatedAt: "2021-03-08T21:46:56.053Z",
  }
]

const newContact = {
  name: "test Name",
  email: "name@mail.com",
  phone: "099 999 99 99",
  password: "12345678",
}

const User = {  
  email: "user-for-test@mail.com",
  _id: "60513a347039433f64247983",
  subscription: "free",
  password: "$2a$08$AjeiHz7oWxEj9Aq2Knd/lOGeurWsAoy/90aoCVZ5yjswULBdB3mmm",
  avatar: "60513a347039433f64247983\\1615936257158-testpng.png",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDUxM2EzNDcwMzk0MzNmNjQyNDc5ODMiLCJpYXQiOjE2MTU5MzYxOTgsImV4cCI6MTYxNjgwMDE5OH0.ecgaQDZzc_ngZTcaqqAw9B8uAqvyjgQ1qQ8gWsjwRpQ"
}

const users = []

users[0] = User

const newUser = { email: 'test-user@test.com', password: '12345678' }

module.exports = { contacts, newContact, User, users, newUser }