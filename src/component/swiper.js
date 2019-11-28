import React, {useState} from 'react';
import Swiper from 'react-id-swiper';
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Grid from "@material-ui/core/Grid";

const SimpleSwiperWithParams= (props) => {
    const styles = theme => ({

    });

    const params = {
        slidesPerView: 5,
        spaceBetween: 30,
        type: 'bullets',
        freeMode: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        renderPrevButton: () => <button onClick={goPrev} className="swiper-button-prev"></button>,
        renderNextButton: () => <button onClick={goNext} className="swiper-button-next"></button>,
    };
    const [swiper, updateSwiper] = useState(null);
    const goNext = () => {
        if (swiper !== null) {
            swiper.slideNext();
        }
    };
    const goPrev = () => {
        if (swiper !== null) {
            swiper.slidePrev();
        }
    };
    const handleChange = async val =>{
        //ユーザの詳細画面へ遷移
        try{
            await this.props.history.push({
                pathname: '/friend/detail/',
                state:{
                    user_id:val,
                    for:'friendAccount'
                }
            })
        } catch (e){
            // this.goError(e)
        }
    };
    const { classes } = props;

    return (
        <div>
            <Swiper{...params}>
                {props.list.map(function (value, id) {
                    let pic = 'https://dol.ismcdn.jp/mwimgs/8/d/670m/img_8db0612c13c0013326bfb1b66431df95645897.jpg';

                    return (
                        <div>
                            <GridListTile key={id} cols={1} onClick={() => handleChange(value.user_id)}>
                                <img src={pic} width={"100%"}/>
                                <GridListTileBar
                                    // title={`${value.profile.basic_info.first_name}` + `${value.profile.basic_info.last_name}`}
                                    // subtitle={<span>by: {val.author}</span>}
                                    actionIcon={
                                        <IconButton >
                                            <InfoIcon/>
                                        </IconButton>
                                    }
                                />
                            </GridListTile>
                        </div>

                    )
                })}
            </Swiper>
            {params.renderNextButton()}
            {params.renderPrevButton()}
        </div>

    )
}

export default SimpleSwiperWithParams;