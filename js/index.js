const wrapper = document.getElementById('wrapper');
const loader = document.getElementById('loader'); 
const button = document.getElementById('button'); 
const name = document.getElementById('name'); 
const price = document.getElementById('price'); 
const izox = document.getElementById('izox'); 
const form = document.getElementById('form'); 

function createRow(phone, index) {
    return `
    <tr  data-id="data_${phone.id}">
        <th scope="row">${index}</th>
        <td class='text-primary' style='cursor:pointer'>${phone.name}</td>
        <td>${phone.price}</td>
        <td>${phone.description}</td>
        <td>
            <span class="text-danger" style="cursor: pointer;">del</span>
            <span class="text-info" style="cursor: pointer;">update</span>
        </td>
    </tr>
    `;
}

document.addEventListener('DOMContentLoaded', function () {
    loader.style.display = 'block'; 

    fetch("https://auth-rg69.onrender.com/api/products/all", {
        method: "GET"
    })
        .then((res) => res.json())
        .then(data => {
            loader.style.display = 'none';

            if (data.length) {
                data.forEach((phone, index) => {
                    let card = createRow(phone, index + 1);
                    wrapper.innerHTML += card;
                });
                const delButton=document.querySelectorAll('span.text-danger');
                if (delButton.length) {
                    delButton.forEach(del =>{
                        del.addEventListener('click',function() {
                            let id=this.parentNode.parentNode?.getAttribute('data-id').substring(5);
                            if (id) {
                                fetch(`https://auth-rg69.onrender.com/api/products/${id}`,{
                                    method:"DELETE"
                                })
                                .then(res=>res.json())
                                .then(data=>{
                                    if (data.message=="Mahsulot muvaffaqiyatli o'chirildi") {
                                        window.location.reload();
                                    }
                                })
                                .catch(err=>{
                                    console.log(err);
                                })
                            }
                        })
                    })
                }

                const nameList=document.querySelectorAll('td.text-primary')
                if (nameList.length) {
                    nameList.forEach(item => {
                        item && item.addEventListener('click', function(){
                            
                            let id=this.parentNode.getAttribute('data-id').substring(5)
                            if(id){
                                window.location.assign(`http://http://127.0.0.1:5500/psge/page.html?id=${id}`)
                            }
                        })
                    })
                }
            }
        })
        .catch(err => {
            loader.style.display = 'none';
            console.log(err);
        });
});

function validator(name,price){
    if (!name.value) {
        alert("Nomini kiriting")
        name.focus();
        return false;
    }
    if (!price.value) {
        alert("narxni kiriting")
        price.focus();
        return false;
    }
    return true;
}
button.addEventListener(`click`,function(a) {
    a.preventDefault();
    
    if (validator(name,price)) {
        let phone={
            name:name.value,
            price:price.value,
            description:izox.value,
            status:"active",
            category_id:"2"
        }

        fetch("https://auth-rg69.onrender.com/api/products",{
            method:"POST",
            headers:{
                'Content-type':"application/json"
            },
            body:JSON.stringify(phone)
        })
        .then(res=>res.json())
        .then(data=>{
            if (data.id) {
                let row=createRow(phone,wrapper.children.length+1);
                wrapper.innerHTML+=row;
                form.reset();
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }
})