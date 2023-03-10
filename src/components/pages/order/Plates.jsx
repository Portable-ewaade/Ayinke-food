import React, { useEffect, useContext, useState, Fragment } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Axios from 'axios'

import NavBar from '../../layouts/partials/NavBar'
import Dropdown from '../../layouts/partials/DropDown';
import InfoBox from '../../layouts/partials/InfoBox';


import UserContext from '../../../context/user/userContext';
import FoodContext from '../../../context/food/foodContext';
import AddressContext from '../../../context/address/addressContext'
import LocationContext from '../../../context/location/locationContext';
import FoodItemContext from '../../../context/foodItem/foodItemContext';

import BottomBar from './BottomBar';
import storage from '../../helpers/storage';
import scroller from '../../helpers/scroller';

import Alert from '../../layouts/partials/Alert'

import colors from '../../helpers/colors'

const Plates = (props) => {

    const userContext = useContext(UserContext);
    const foodContext = useContext(FoodContext);
    const addressContext = useContext(AddressContext)
    const locationContext = useContext(LocationContext);
    const foodItemContext = useContext(FoodItemContext);

    const history = useHistory();
    let _add, desc, cdAuth, idBill;

    const [plates, setPlates] = useState([]);
    const [iconShow, setIcon] = useState(false);
    const [totalPrice, setPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [useCard, setUseCard] = useState(true);
    const [useBill, setUseBill] = useState(true);
    const [showAdd, setShowAdd] = useState(false)
    const [dStart, setDstart] = useState(false)

    const [aData, setAData] = useState({
        type: '',
        message: '',
        show: false
    })

    const [card, setCard] = useState({
        cardBin: '564783',
        last4: '4357',
        authCode: 'OIUYTRTYUIOIUYT_',
        type:'debit',
        brand: 'matsercard'
    })

    const [customer, setCustomer] = useState({
        firstName: '',
        email: '',
        phoneNumber: '',
        address: '',
        location: {
            name: ''
        },
        authCode: '',
        description: '',
        billingId: ''
    })

    useEffect(async () => {

        locationContext.getLocations();
        foodContext.getAllFood(9999);
        foodItemContext.getRestFoodItems(storage.getPlate()[0].restaurant)

        setPlates(storage.getPlate());
        calcDefPrice(storage.getPlate()[0].items)

        Axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

        checkCustomer();


    }, []);

    const logout = async (e) => {

        if(e) e.preventDefault();

        localStorage.removeItem('userId')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('token')

        await Axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`);
        window.location.reload();

    }

    const checkLogin = () => {

        if(storage.checkUserID() && storage.checkRestaurantID() && storage.checkToken() && 
        (storage.getUserID().toString() === storage.getRestaurantID().toString())){

            return true;

        }else{

            return false;

        }

    }

    const checkCustomer = async () => {

        if(storage.checkUserID() && storage.checkToken()){

            await userContext.getUser();

            if(storage.getUserID().toString() !== storage.getRestaurantID().toString()){
                
                await userContext.getBillings(storage.getUserID());
                await userContext.getCards(storage.getUserID());

                setUseBill(true);
                setUseCard(true);
                setCustomer({ ...customer, phoneNumber: userContext.user.phoneNumber })
            }

        }

    }

    const showIcon = () => {
        setIcon(!iconShow);
    }

    const toggleAdd = (e) => {
        if(e) e.preventDefault();
        setShowAdd(!showAdd);
    }

    const goBack = (e) => {
        if(e) e.preventDefault();
        history.goBack()
    }

    const toggleCard = (e) => {
        if(e) e.preventDefault();
        setUseCard(!useCard);
    }

    const toggleBill = (e) => {
        if(e) e.preventDefault();
        setUseBill(!useBill);

        setTimeout(() => {
            setCustomer({ ...customer, phoneNumber: userContext.phoneNumber, location: { name: '' }, description: ''})
        }, 5000)
    }

    const calcDefPrice = (data) => {

        let price = 0;
        for(let m = 0; m < data.length; m++){
            
            price = price + data[m].price;

        }

        setPrice(price);

    }

    const cardIcon = (type) => {

        let icon;

        if(type === 'mastercard'){
            icon = 'mcard.svg'
        }else if(type === 'visa'){
            icon = 'visa.svg'
        }else{
            icon = ''
        }

        return '../../images/icons/' + icon;

    }

    const getCards = () => {

        const card = userContext.cards.map((cd) => {
            const c ={
                value: true,
                label: 'Ending in ...'+ cd.cardLast,
                left: '',
                image: cardIcon(cd.brand)
            }
            return c;
        });

        return card;
    }

    const getSelectedCard = (val) => {
        setCustomer({ ...customer, isAuth: val.value ? true : false });
    }

    const setDefaultCard = () => {

        const cd = userContext.cards[0];
        const card ={
            value: true,
            label: 'Ending in ...'+ cd.cardLast,
            left: '',
            image: cardIcon(cd.brand)
        }

        cdAuth = true

        return card;
    }

    const getBillings = () => {

        const bill = userContext.billings.map((b) => {
            const c ={
                value: b.location.name + ' ' + b._id,
                label: b.address,
                left: b.description,
                image: ''
            }
            return c;
        });

        return bill;
    }

    const getSelectedBill = (val) => {
        console.log(val);
        setCustomer({ ...customer, location: { name: val.value.split(' ')[0] },  address: val.label, description: val.left, billingId: val.value.split(' ')[1]});
        locationContext.getDelivery({ user: storage.getRestaurantID(), location: val.value.split(' ')[0] });
        setDstart(true)
    }

    const setDefaultBill = () => {

        const b = userContext.billings[0];
        const bill ={
            value: b.location.name + ' ' + b._id,
            label: b.address,
            left: '',
            image: ''
        }

        _add = b.address;
        desc = b.description;
        idBill = b._id;
        return bill;
    }

    const mergeFoodNames = (data) => {

        let names = '';
        for(let i = 0; i < data.length; i++){
            names = names + `${names === '' ? '' : ' + '}` + data[i].food.name;
        }
        return names;

    }

    const calcNewPrice = (data) => {

        let price = 0;
        for(let m = 0; m < data.length; m++){
            
            price = price + data[m].price;

        }

        return price;

    }

    const getFood = (id) =>{

        const food = foodItemContext.restFoodItems.find((fd) => fd._id === id);
        return food;

    }

    const inc = async (e, op, data, elemId, priceId, plateId, plateIndex) => {

        if(e) e.preventDefault();

        const foodItem = await getFood(data.foodId);

        let qtyElem = document.getElementById(elemId);
        let qtyPrice = document.getElementById(priceId);
        let plate = document.getElementById(plateId);

        let currPlate = plates;
        let qtArr = [];
        let newfood = data;

        const qty = op === 'add' ? data.qty + 1 : data.qty - 1;
        newfood.qty = qty <= 0 ? 1 : qty;
        newfood.price = foodItem.price * newfood.qty;

        // set a temp array
        qtArr.push(newfood);

        // calculate new total price here
        const newTotal = await calcNewPrice(currPlate[plateIndex].items);

        // increaset quantity of food item in plate
        currPlate.forEach((plate) => {
            plate.items.map(p => qtArr.find(fd => fd.foodId === p.foodId))
        })

        // set the qty display
        qtyElem.innerHTML = newfood.qty.toString();

        // set the price display
        qtyPrice.innerHTML = newfood.price;

        // set the new total price
        currPlate[plateIndex].totalPrice = newTotal;
        plate.innerHTML = newTotal.toString();
        setPrice(newTotal)

        setPlates(currPlate); // save state

        storage.setPlate(currPlate); // save to local storage
    }

    const getLocations = () => {
        const loc = locationContext.locations.map((l) => {
            const c ={
                value: l._id,
                label: l.name,
                left: '',
                image: ''
            }
            return c;
        });

        return loc;
    }

    const getSelected = (val) => {
        setCustomer({ ...customer, location: { name: val.label }});
        locationContext.getDelivery({ user: storage.getRestaurantID(), location: val.value });
        setDstart(true)
    }




    return(
        <>
            <NavBar />

            <section >

                <div className="container ordder">
                    
                    <div className="row">
                        <div className="col-lg-8 mx-auto">

                        <div className="d-flex align-items-center mrgt">

                            <Link onClick={(e) => goBack(e)} className="pdr">
                                <span className="fe fs-18 fe-chevron-left" style={{color: colors.neutral.grey, position: 'relative', top:'1px', left: '-5px'}}></span>
                            </Link>

                            <h3 onClick={(e) => { e.preventDefault(); console.log(plates)}} className="title fs-18 font-metrobold mrgb0" style={{color: colors.primary.green}}>Your Plate</h3>

                        </div>

                    <div className="plate-bx mrgt1">

                    {
                        plates && plates.length > 0 &&
                        <>
                            {
                                plates.map((plate, i) => 
                                
                                    <>
                                        <div className="plate-itm">
                                            <div className="plate-jumbo" style={{backgroundColor: colors.accent.pink}}>
                                                <div>
                                                    <span className="font-metrobold fs-15">Plate { (i+1) } - </span>
                                                    <span id={`platefd${i}`} className="font-metromedium fs-14 pdl" style={{position: 'relative', top:'0px'}}>&#x20A6;{plate.totalPrice}</span>
                                                    <p className="font-metromedium fs-12 mb-1">{ mergeFoodNames(plate.items) }</p>
                                                </div>

                                                <a onClick={showIcon} className=""  
                                                data-toggle="collapse" 
                                                href="#multiCollapseExample1" 
                                                aria-expanded="false" 
                                                aria-controls="multiCollapseExample1">
                                                    <span className={`fe fe-chevron-${iconShow ? 'up' : 'down'} fs-17`}></span>
                                                </a>

                                            </div>

                                            <div className="collapse multi-collapse" id="multiCollapseExample1">
                                                
                                                <div className="plate-cont" style={{backgroundColor: colors.neutral.greyLight.three}}>

                                                    {
                                                        plate.items.map((fd, index) => 
                                                        <>
                                                            <div className="plate-fd" style={{color: colors.primary.green}}>

                                                                <div>
                                                                    <span className="font-metromedium fs-14">{ fd.food.name }</span>
                                                                    <span className="font-metromedium fs-14 pdl" style={{position: 'relative', top:'0px'}}>
                                                                        &#x20A6;<i id={`fd-price${index}`} className="font-metromedium fs-14 ui-font-normal">{fd.price}</i>
                                                                    </span>
                                                                </div>

                                                                <div className="ml-auto">

                                                                    <Link onClick={(e) => inc(e, 'sub', fd, `fd-qty${index}`, `fd-price${index}`, `platefd${i}`, i)} className="minus"><span className="fe fe-minus fs-13"></span></Link>
                                                                    <span id={`fd-qty${index}`} className="font-metromedium fs-13 qty">{fd.qty}</span>
                                                                    <Link onClick={(e) => inc(e, 'add', fd, `fd-qty${index}`, `fd-price${index}`, `platefd${i}`, i)} className="plus"><span className="fe fe-plus fs-13"></span></Link>

                                                                </div>

                                                            </div>
                                                        </>
                                                        )
                                                    }

                                                </div>

                                            </div>
                                            
                                        </div>
                                    </>

                                )
                            }    
                        </>
                    }

                    <div className="ui-line bg-silverlight"></div>

                    <div className="dlv-bx">

                        <h3 className="font-metromedium fs-14 mrgb0" style={{color: colors.primary.green}}>Delivery price</h3>
                        <h3 className="font-metrobold fs-14 ml-auto mrgb0" style={{color: colors.neutral.grey}}>
                            {
                                !locationContext.loading && storage.checkObject(locationContext.delivery) > 0 && 
                                <>&#x20A6;{ locationContext.delivery.price }</>
                            }

                            {/* {
                                !locationContext.loading && ( locationContext.delivery === null ) &&
                                <>&#x20A6;0</>
                            } */}

                            {
                                !locationContext.loading && storage.checkObject(locationContext.delivery) <= 0 && dStart === true &&
                                <>&#x20A6;0</>
                            }

                            {
                                !locationContext.loading && storage.checkObject(locationContext.delivery) <= 0 && dStart === false &&
                                <>Choose location</>
                            }

                            {
                                locationContext.loading && storage.checkObject(locationContext.delivery) <= 0 &&
                                <>Getting price</>
                            }

                        </h3>

                    </div>

                    </div>

                        </div>
                    </div>
                    <div className="ui-line bg-silverlight mrgb1"></div>
                    
                    <div className="row">
                        <div className="col-lg-5 mx-auto">
                            
                   <div>
                        <div className="d-flex align-items-center mrgt2">

                        <h3 className="font-metromedium fs-14 mrgb0" style={{color: colors.primary.green}}>How do we find you?</h3>
                        <h3 className="font-metromedium fs-14 ml-auto mrgb0 onsilver">Billing details</h3>

                        </div>

                        {
                            !storage.checkToken() && (!storage.checkUserID() || storage.checkUserID()) &&
                            <h3 className="font-metrolight fs-13 mrgb0 onmineshaft mt-3" style={{lineHeight: '18px'}}>
                            Supply your email and phone number, pick a location and tell us your address. 
                            Your order will be delivered to your door step.
                            </h3>
                        }

                        {
                            storage.checkToken() && (!storage.checkUserID() || storage.checkUserID()) &&
                            <h3 className="font-metrolight fs-13 mrgb0 onmineshaft mt-3" style={{lineHeight: '18px'}}>
                            Confirm your billing details and use a new card or your previous card.
                            </h3>
                        }

                        {
                            userContext.loading &&
                            <>

                                <div className="dmr-bx" style={{backgroundColor: colors.accent.yellowLight}}>

                                    <div className="load--bx food-empty">
                                        <img src="../../../images/assets/spinner.svg" className="spinner" alt="spinner" />
                                    </div>

                                </div>

                            </>
                        }

                        {
                            !userContext.loading && !checkLogin() && userContext.billings.length <= 0 && userContext.cards.length <= 0  &&
                            <>
                                <form className="gnr-form mrgt1" onSubmit={(e) => e.preventDefault()}>

                                    <Alert show={aData.show} type={aData.type} message={aData.message} />

                                    <div className="row">

                                        <div className="col-md-6 inline">

                                            <div className="form-group">
                                                <label className="font-metromedium fs-13 mb" style={{color: colors.primary.green}}>First name</label>
                                                <input 
                                                defaultValue={(e) => setCustomer({...customer, firstName: e.target.value})}
                                                onChange={(e) => setCustomer({...customer, firstName: e.target.value})}
                                                type="text" 
                                                className="form-control font-metrolight fs-13" 
                                                placeholder="E.g. Wale" />
                                            </div>

                                        </div>

                                        <div className="col-md-6 inline">

                                            <div className="form-group">
                                                <label className="font-metromedium fs-13 mb" style={{color: colors.primary.green}}>Email</label>
                                                <input 
                                                defaultValue={(e) => setCustomer({...customer, email: e.target.value})}
                                                onChange={(e) => setCustomer({...customer, email: e.target.value})}
                                                type="text" 
                                                className="form-control font-metrolight fs-13" 
                                                placeholder="yourmail@you.com" />
                                            </div>

                                        </div>

                                    </div>

                                    <div className="row">

                                        <div className="col-md-6 inline">
                                            <div className="form-group">
                                                <label className="font-metromedium fs-13 mb" style={{color: colors.primary.green}}>Phone</label>
                                                <input 
                                                defaultValue={(e) => setCustomer({...customer, phoneNumber: e.target.value})}
                                                onChange={(e) => setCustomer({...customer, phoneNumber: e.target.value})}
                                                type="text" 
                                                className="form-control font-metrolight fs-13" 
                                                placeholder="080xxx" />
                                            </div>
                                        </div>

                                        <div className="col-md-6 inline">
                                            <div className="form-group">
                                                <label className="font-metromedium fs-13 mb" style={{color: colors.primary.green}}>Location</label>
                                                <Dropdown options={getLocations} selected={getSelected} placeholder={`Select`} search={true}  />
                                            </div>
                                        </div>

                                    </div>

                                    <div className="form-group">
                                        <div className="d-flex align-items-center mb">
                                            <label className="font-metromedium fs-13" style={{color: colors.primary.green}}>Address</label>
                                            <Link onClick={(e) => toggleAdd(e)} className="font-metromedium fs-13 ml-auto mb-1" style={{color: colors.primary.orange}}>
                                                {
                                                    showAdd ? 'Remove' : 'Add description'
                                                }
                                            </Link>
                                        </div>
                                        <input 
                                        defaultValue={(e) => setCustomer({...customer, address: e.target.value})}
                                        onChange={(e) => setCustomer({...customer, address: e.target.value})}
                                        type="text" 
                                        className="form-control font-metrolight fs-13" 
                                        placeholder="your address" />
                                    </div>

                                    {
                                        showAdd &&
                                        <div className="form-group">
                                        <label className="font-metromedium fs-13 mb" style={{color: colors.primary.green}}>Description</label>
                                            <textarea 
                                            defaultValue={(e) => setCustomer({...customer, description: e.target.value})}
                                            onChange={(e) => setCustomer({...customer, description: e.target.value})}
                                            type="text" 
                                            className="form-control font-metrolight fs-13" 
                                            placeholder="Type here"></textarea>
                                        </div>
                                    }

                                </form>

                            </>
                        }

                        {
                            !userContext.loading && userContext.billings.length > 0 && userContext.cards.length > 0 &&
                            <>

                                <form className="gnr-form mrgt1" onSubmit={(e) => e.preventDefault()}>

                                    <Alert show={aData.show} type={aData.type} message={aData.message} />

                                    {
                                        !userContext.loading && userContext.cards.length > 0 &&
                                        <>
                                            <div className="form-group">
                                                <div className="d-flex align-items-center">
                                                    <label className="font-metromedium fs-13 mb" style={{color: colors.primary.green}}>Previous card</label>  
                                                    <Link onClick={(e) => toggleCard(e)} className="font-metromedium fs-13 mb-1 ml-auto" style={{color: colors.primary.orange}}>{ useCard ? 'Don\'t use' : 'Use card' }</Link>
                                                </div>
                                                {
                                                    useCard &&
                                                    <Dropdown 
                                                    options={getCards} 
                                                    selected={getSelectedCard} 
                                                    defaultValue={setDefaultCard()} 
                                                    placeholder={`Select`} 
                                                    displayLeft={true}
                                                    image={true}
                                                    className="card-drop" 
                                                    search={false}  />
                                                }
                                            </div>
                                        </>
                                    }

                                    {
                                        !userContext.loading && userContext.billings.length > 0 &&
                                        <>
                                            <div className="form-group">
                                                <div className="d-flex align-items-center">
                                                    <label className="font-metromedium fs-13 mb" style={{color: colors.primary.green}}>Prev Address</label>  
                                                    <Link onClick={(e) => toggleBill(e)} className="font-metromedium fs-13 mb-1 ml-auto" style={{color: colors.primary.orange}}>{ useBill ? 'Add new' : 'Remove' }</Link>
                                                </div>
                                                {
                                                    useBill &&
                                                    <>
                                                        <Dropdown 
                                                        options={getBillings} 
                                                        selected={getSelectedBill} 
                                                        defaultValue={setDefaultBill()} 
                                                        placeholder={`Select`} 
                                                        displayLeft={false} 
                                                        className="card-drop" 
                                                        search={false}  />

                                                        <div class="d-flex mt-1">
                                                            <div className="pdr">
                                                                <img src="../../../images/icons/check-g.svg" alt="check" width="18px" />
                                                            </div>
                                                            <h3 className="font-metromedium fs-13 mrgb0 onmineshaft mt-1" style={{lineHeight: '18px'}}>
                                                                {
                                                                    customer.address === '' && customer.description === '' &&
                                                                    <>{ `${_add}. ${desc}` }</>
                                                                }
                                                                {
                                                                    customer.address !== '' && (customer.description !== '' || customer.location.name !== '') &&
                                                                    <>{ `${customer.address}. ${customer.description}` }</>
                                                                }
                                                            </h3>
                                                        </div>
                                                        
                                                    </>
                                                }

                                            </div>
                                        </>
                                        
                                    }

                                    {
                                        !useBill &&
                                        <>
                                            <div className="row">

                                                <div className="col-md-6 inline">
                                                    <div className="form-group">
                                                        <label className="font-metromedium fs-13 mb" style={{color: colors.primary.green}}>Phone</label>
                                                        <input 
                                                        defaultValue={ (e) => setCustomer({...customer, phoneNumber: e.target.value}) }
                                                        onChange={(e) => setCustomer({...customer, phoneNumber: e.target.value})}
                                                        type="text" 
                                                        className="form-control font-metrolight fs-13" 
                                                        placeholder="080xxx" />
                                                    </div>
                                                </div>

                                                <div className="col-md-6 inline">
                                                    <div className="form-group">
                                                        <label className="font-metromedium fs-13 mb" style={{color: colors.primary.green}}>Location</label>
                                                        <Dropdown options={getLocations} selected={getSelected} placeholder={`Select`} search={true}  />
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="form-group">
                                                <div className="d-flex align-items-center mb">
                                                    <label className="font-metromedium fs-13" style={{color: colors.primary.green}}>Address</label>
                                                    <Link onClick={(e) => toggleAdd(e)} className="font-metromedium fs-13 ml-auto mb-1" style={{color: colors.primary.orange}}>
                                                        {
                                                            showAdd ? 'Remove' : 'Add description'
                                                        }
                                                    </Link>
                                                </div>
                                                <input 
                                                defaultValue={(e) => setCustomer({...customer, address: e.target.value})}
                                                onChange={(e) => setCustomer({...customer, address: e.target.value})}
                                                type="text" 
                                                className="form-control font-metrolight fs-13" 
                                                placeholder="your address" />
                                            </div>

                                            {
                                                showAdd &&
                                                <div className="form-group">
                                                <label className="font-metromedium fs-13 mb" style={{color: colors.primary.green}}>Description</label>
                                                    <textarea 
                                                    defaultValue={(e) => setCustomer({...customer, description: e.target.value})}
                                                    onChange={(e) => setCustomer({...customer, description: e.target.value})}
                                                    type="text" 
                                                    className="form-control font-metrolight fs-13" 
                                                    placeholder="Type here"></textarea>
                                                </div>
                                            } 
                                        </>
                                    }



                                </form>

                            </>
                        }

                        
                   </div>

                        </div>
                    </div>

                </div>

            </section>
     
  
            
        </>
    )

}

export default Plates;