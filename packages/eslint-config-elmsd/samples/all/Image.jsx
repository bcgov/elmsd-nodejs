// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from "prop-types"

function Image({ alt, ...rest }) {
    return <img alt={alt} {...rest} />
}

Image.propTypes = {
    alt: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired
}

export default Image
