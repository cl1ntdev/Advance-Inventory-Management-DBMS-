
const VerifyAccount = async(user_input) => {
    console.log('verifying')
    const response = await fetch('http://127.0.0.1:8080/verify-account',{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user_input)
    })
    const user = await response.json();
    console.log(user)
    if(user){
        AccountAssign(user) //account designation.js
    }

}