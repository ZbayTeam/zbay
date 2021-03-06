import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AliceCarousel from 'react-alice-carousel'
import Typography from '@material-ui/core/Typography'
import * as R from 'ramda'
import 'react-alice-carousel/lib/alice-carousel.css'

import carouselStrings from '../../static/text/carouselStrings.js'

const styles = theme => ({
  typography: {
    color: theme.palette.colors.black,
    width: 542,
    fontSize: 18,
    lineHeight: '24px',
    textAlign: 'center'
  },
  tipContainer: {
    width: '100%',
    height: 130,
    display: 'flex',
    justifyContent: 'center'
  }
})

export const Carousel = ({ classes }) => {
  const [lastSlideSlide, setLastSlide] = useState(0)
  return (
    <AliceCarousel buttonsDisabled dotsDisabled autoPlay autoPlayInterval={8000} startIndex={lastSlideSlide} onSlideChange={(e) => setLastSlide(e.item + 1)}>
      {carouselStrings.map((text, i) => (
        <div key={i} className={classes.tipContainer}>
          <Typography className={classes.typography} variant='body1'>
            {text}
          </Typography>
        </div>
      ))}
    </AliceCarousel>
  )
}

Carousel.propTypes = {
  classes: PropTypes.object.isRequired
}

export default R.compose(
  withStyles(styles),
  React.memo
)(Carousel)
