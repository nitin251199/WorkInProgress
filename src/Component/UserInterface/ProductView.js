import React, { useState, useEffect, createRef } from "react";
import Header from "./Header";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Button, Divider } from '@material-ui/core'
import { getData, postData, ServerURL } from "../FetchNodeServices";
import { useDispatch, useSelector } from "react-redux";
import ShopCart from "./ShopCart";
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Radio from '@material-ui/core/Radio';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowForwardIos from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import Footer from "./Footer";

const useStyles = makeStyles((theme) => ({}));

export default function ProductView(props) {

    var picSlider = createRef()
    var picBigSlider = createRef()

    var settings = {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        focusOnSelect: true
    };

    var bigSettings = {
        dots: false,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
    };

    var dispatch = useDispatch()
    var cart = useSelector(state => state.cart)
    var product = props.location.state.itemProps
    const [selected, setSelected] = useState(props.location.state.selected)
    var item = props.location.state.item
    const [refresh, setRefresh] = useState(false)
    const [picSelected, setPicSelected] = useState("");
    const [productPicture, setProductPicture] = useState([]);


    const fetchAllProductPictures = async () => {
        var body = { "finalproductid": selected.finalproductid }
        var result = await postData("finalproduct/fetchallproductpictures", body)
        setProductPicture(result.data)
    }

    useEffect(function () {
        fetchAllProductPictures()
    }, [selected])


    const classes = useStyles();

    const breadcrumbs = () => {
        return (
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit"
                    style={{ fontSize: 12, letterSpacing: 1 }}
                >
                    <Typography variant="overline" color="textPrimary" style={{ fontSize: 12, letterSpacing: 1 }}>HOME</Typography>
                </Link>
                <Link color="inherit"

                    style={{ fontSize: 12, letterSpacing: 1 }}
                >
                    <Typography variant="overline" color="textPrimary" style={{ fontSize: 12, letterSpacing: 1 }}>GLASSKART</Typography>
                </Link>
                <Typography variant="overline" color="textPrimary" style={{ fontSize: 12, letterSpacing: 1 }}>{product.productname}</Typography>
            </Breadcrumbs>
        )

    }

    const handleChange = async (item) => {
        var { finalproductid, colorid, colorname, offerprice, price, productpicture, stock } = item
        setSelected({ finalproductid, colorid, colorname, offerprice, price, productpicture, stock })
        setRefresh(!refresh)
    }

    const handleQtyChange = (value) => {
        var data = { ...product, ...selected, qty: value }
        if (value == 0) { dispatch({ type: "REMOVE_CART", payload: [selected.finalproductid] }) }
        else {
            dispatch({ type: "ADD_CART", payload: [selected.finalproductid, data] })
        }
        setRefresh(!refresh)
    }

    const clickThumbNails = (item, index) => {
        setPicSelected(item.pictureid);
        picSlider.current.slickNext()
        picBigSlider.current.slickGoTo(index)
    };

    const showProductPicture = () => {
        return productPicture.map((picture, index) => {
            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <div
                        onClick={() => clickThumbNails(picture, index)}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            border: picture.pictureid == picSelected
                                ? "1px solid #000"
                                : "1px solid #e2e2e2",
                            borderRadius: 5,
                            cursor: 'pointer',
                            height: 90,
                            margin: 2
                        }}>
                        <img src={`${ServerURL}/images/${picture.image}`} width='65px' />
                    </div>
                </div>
            )
        }
        )
    }

    const showBigProductPicture = () => {
        return productPicture.map((picture) => {
            return (
                <div style={{
                     display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '70vh',
                    }}>


                        <img src={`${ServerURL}/images/${picture.image}`}
                            width="100%"  />

                    </div>
                </div>
            )
        })
    }



    const displayProduct = (props) => {
        return (
            <div style={{ paddingInline: 25 }}>
                <Grid container spacing={5}>
                    <Grid item xs={8}>
                        <div style={{ textAlign: 'center', marginBottom: 10 }}>Product View</div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <ArrowBackIos color="action" style={{ cursor: 'pointer', }} onClick={() => {
                                picSlider.current.slickPrev()
                                picBigSlider.current.slickPrev()
                            }} />
                            <div style={{
                                width: "100%"
                            }}>
                                <Slider {...bigSettings} ref={picBigSlider} >
                                    {showBigProductPicture()}
                                </Slider>
                            </div>
                            <ArrowForwardIos color="action" style={{ cursor: 'pointer', }} onClick={() => {
                                picSlider.current.slickNext()
                                picBigSlider.current.slickNext()
                            }} />
                        </div>

                        <Grid item xs={12}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 0, alignItems: 'center' }}>
                                <ul style={{ listStyle: 'none', border: '1px solid #000', display: 'flex', padding: 3, borderRadius: 40, pointerEvents: 'none', left: 10 }}>
                                    <li style={{ paddingLeft: 4 }}>4.6</li>
                                    <li style={{ paddingInline: 4 }}>
                                        <a style={{ color: '#434343' }}>★
                                        </a>
                                    </li>
                                    <li style={{ color: '#888', borderLeft: '1px solid #868686', paddingInline: 4 }}>86</li>
                                </ul>

                                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                    <div style={{ position: 'static' }} data-variant-id="34641931276">
                                        <div style={{ width: 25, height: 25, backgroundSize: '100%', backgroundImage: "url('./wishlist_heart.png')" }}>
                                        </div></div></div></div>
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        <div style={{ fontSize: 20, letterSpacing: 1 }}>
                            {product.productname}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span>{selected.colorname}</span>

                                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                                    {item.details.map((finalitem) => {
                                        return (<div>
                                            <Radio
                                                checked={selected.finalproductid === finalitem.finalproductid}
                                                onChange={() => handleChange(finalitem)}
                                                //value="a"
                                                style={{ color: finalitem.colorname }}
                                                name="radio-button-demo"
                                                inputProps={{ 'aria-label': 'A' }}
                                            />
                                        </div>)
                                    })}

                                </div>

                                {/* <li style={{listStyle:'none',}}>
                            <ul style={{
                                width: '100%',
                                listStyle:'none',
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'start',
                                alignItems: 'center',
                                padding:0,
                                marginTop: 11
                            }}>
                                <li style={{listStyle:'none',}}>
                                    <span style={{
                                        display: 'block',
                                        padding: 2,
                                        borderRadius: '100%',
                                        border: '2px solid #666'
                                    }}>
                                        <div style={{
                                            color: "#404040",
                                            listStyle: "none",
                                            WebkitTapHighlightColor: "transparent",
                                            padding: 0,
                                            border: 0,
                                            font: "inherit",
                                            verticalAlign: "baseline",
                                            wordWrap: "break-word",
                                            boxSizing: "border-box",
                                            borderRadius: "100%",
                                            backgroundColor:'silver',
                                            width: 20,
                                            height: 20,
                                            margin: 0,
                                            display: "block",
                                            cursor: "pointer",
                                            backgroundPosition: "center",
                                            backgroundSize: "contain",
                                        }}>
                                        onClick={()=>handleRadioClick()}
                                            </div>
                                    </span>
                                </li>
                            <li >
                                <span style={{
                                    lineHeight: 'inherit',
                                    display: 'block',
                                    padding: 2,
                                    borderRadius: '100%',
                                    margin: 5
                                }}>
                                    <div style={{
                                        color: "#404040",
                                        listStyle: "none",
                                        WebkitTapHighlightColor: "transparent",
                                        padding: 0,
                                        border: 0,
                                        font: "inherit",
                                        verticalAlign: "baseline",
                                        wordWrap: "break-word",
                                        boxSizing: "border-box",
                                        borderRadius: "100%",
                                        width: 20,
                                        height: 20,
                                        margin: 0,
                                        display: "block",
                                        cursor: "pointer",
                                        backgroundColor:'pink',
                                        backgroundPosition: "center",
                                        backgroundSize: "contain",
                                    }}>
                                    </div>
                                </span>
                            </li>
                            </ul>
                        </li> */}
                            </div>
                            <div>
                                <div>
                                    <div style={{ textAlign: 'start', fontSize: 20 }}>{selected.offerprice > 0 ? <span style={{ fontSize: 18 }}><s>&#8377;{selected.price}</s> &nbsp; <span style={{ color: '#0984e3', fontSize: 22 }}>&#8377;{selected.offerprice}</span></span> : <span>&#8377;{selected.price}</span>}</div>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>including premium<br /> anti-glare lenses
                                        <div style={{
                                            margin: 10,
                                            width: 20,
                                            height: 20,
                                            textAlign: 'center',
                                            borderRadius: '50%',
                                            border: '1px solid #50526e',
                                            cursor: 'pointer',
                                            color: '#50526e'
                                        }}>?
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ paddingTop: 30, paddingBottom: 30, width: 370 }}>

                            <Slider {...settings} ref={picSlider}>
                                {showProductPicture()}
                            </Slider>
                        </div>

                        <div style={{ paddingTop: 0, paddingRight: 50 }}>

                            <div style={{ listStyle: 'none' }}>
                                <div style={{ padding: 10, fontWeight: 700 }}>
                                    {selected.stock == 0 ? <span style={{ color: 'red' }}>Out of Stock</span> : selected.stock >= 1 && selected.stock <= 3 ? <span style={{ color: 'red' }}>Hurry! only {selected.stock} items left</span> : <span style={{ color: 'green' }}>In Stock</span>}
                                </div>
                                <ShopCart value={cart.hasOwnProperty(selected.finalproductid) ? cart[selected.finalproductid].qty : 0} onChange={(value) => handleQtyChange(value)} />

                                <li style={{ listStyle: 'none', display: 'block', background: '#FFF', color: '#000', padding: 20, textAlign: 'center', marginTop: 10, fontFamily: 'Helvetica', fontSize: 16, letterSpacing: 1, cursor: 'pointer', border: '1px solid' }}>
                                    <span style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                                        <img src='./whatsapp.png' width="20px" />
                                        Let's Chat
                                    </span>
                                </li>
                            </div>
                        </div>
                    </Grid>

                </Grid>
            </div>
        )
    }


    return (
        <div>
            <Header history={props.history} setRefresh={setRefresh} />
            <div style={{ marginLeft: 30, marginTop: 30 }}>
                {breadcrumbs()}
            </div>
            {displayProduct()}
            <div>
                <div style={{ paddingInline: 30 }}>
                    <img src="1.jpg" width="100%" />
                </div>
                <div style={{ marginTop: 35, marginBottom: 35, }}>
                    <ul style={{
                        color: '#9a9a9a',
                        letterSpacing: 1,
                        lineHeight: 1.5,
                        listStyle: 'disc',
                        fontSize: 18,
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}
                    >
                        <li style={{ color: '#5f9595', marginLeft: 15, marginRight: 15 }}>Best suited for powers upto -8 / +5</li>
                        <li style={{ marginLeft: 15, marginRight: 15 }}>Made in rich acetate from Italian powerhouse Mazzucchelli.</li>
                        <li style={{ marginLeft: 15, marginRight: 15 }}>Sophisticated Rounds for a classic look.</li>
                        <li style={{ marginLeft: 15, marginRight: 15 }}>Comes with a complimentary micro-fibre cloth and a classic JJ eyewear case.</li>
                        <li style={{ marginLeft: 15, marginRight: 15 }}>Alias - Rich Acetate JJ E11515 Unisex Transparent Eyeglasses</li>
                    </ul>
                </div>
                <div style={{ padding: 20 }}>
                    <img src="2.jpg" width="100%" />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h1>Key Features</h1>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <img src="3.jpg" />
                    <img src="4.jpg" />
                    <img src="5.jpg" />
                    <img src="6.jpg" />
                    <img src="7.jpg" />
                    <img src="8.jpg" width="594px" />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ display: 'block', fontWeight: 'bolder', fontSize: 32, color: '#404040', textAlign: 'center', margin: 17, letterSpacing: 0.5 }}>Our Lenses</h1>
                </div>
                <div style={{ paddingLeft: 30, paddingRight: 30, margin: 0 }}>
                    <div style={{ boxShadow: '0 0 3px', padding: 10, margin: '0 0 10px 0', position: 'relative', borderRadius: 6, textAlign: 'left' }}>
                        <div style={{
                            width: 0,
                            height: 0,
                            borderTop: '5px solid transparent',
                            borderBottom: '5px solid transparent',
                            borderLeft: '5px solid #404040',
                            position: "absolute",
                            right: '4%',
                            top: '50%'
                        }}></div>
                        <div style={{ color: '#404040', fontSize: 20, marginBottom: '0.3em', letterSpacing: 0, fontWeight: 700 }}>Single Vision</div>
                        <div style={{ margin: 0, padding: '0 10% 0 0', color: '#9a9a9a', fontSize: 14 }}>These lenses correct a single field of vision - near, intermediate, or distance</div>
                    </div>
                    <div style={{ boxShadow: '0 0 3px', padding: 10, margin: '0 0 10px 0', position: 'relative', borderRadius: 6, textAlign: 'left' }}>
                        <div style={{
                            width: 0,
                            height: 0,
                            borderTop: '5px solid transparent',
                            borderBottom: '5px solid transparent',
                            borderLeft: '5px solid #404040',
                            position: "absolute",
                            right: '4%',
                            top: '50%'
                        }}></div>
                        <div style={{ color: '#404040', fontSize: 20, marginBottom: '0.3em', letterSpacing: 0, fontWeight: 700 }}>Multifocal</div>
                        <div style={{ margin: 0, padding: '0 10% 0 0', color: '#9a9a9a', fontSize: 14 }}>These lenses correct near, intermediate and distant fields of vision, eliminating the need to switch eyeglasses</div>
                    </div>
                    <div style={{ boxShadow: '0 0 3px', padding: 10, margin: '0 0 10px 0', position: 'relative', borderRadius: 6, textAlign: 'left' }}>
                        <div style={{
                            width: 0,
                            height: 0,
                            borderTop: '5px solid transparent',
                            borderBottom: '5px solid transparent',
                            borderLeft: '5px solid #404040',
                            position: "absolute",
                            right: '4%',
                            top: '50%'
                        }}></div>
                        <div style={{ color: '#404040', fontSize: 20, marginBottom: '0.3em', letterSpacing: 0, fontWeight: 700 }}>Zero Power</div>
                        <div style={{ margin: 0, padding: '0 10% 0 0', color: '#9a9a9a', fontSize: 14 }}>These protect your eyes from harmful blue light emitted by digital screens and keep the glare off in style</div>
                    </div>
                </div>
                <div style={{ padding: 30 }}>
                    <img src="9.jpg" width="100%" />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ display: 'block', fontWeight: 'bolder', fontSize: 32, color: '#404040', textAlign: 'center', margin: 17, letterSpacing: 0.5 }}>Frame Size</h1>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexFlow: 'wrap', padding: 30 }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <img src="10.png" width="540px" />
                        <span style={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}>Lens Width</span>
                        <span style={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}>49 mm</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <img src="11.png" width="540px" />
                        <span style={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}>Nose Bridge</span>
                        <span style={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}>20 mm</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <img src="12.png" width="540px" />
                        <span style={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}>Temple Length</span>
                        <span style={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}>140 mm</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <img src="13.png" width="540px" />
                        <span style={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}>Frame Size</span>
                        <span style={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}>135 mm</span>
                    </div>
                </div>
            </div>
            <Footer history={props.history} />
        </div>
    )
}