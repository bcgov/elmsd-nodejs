// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from "prop-types"

const Component = (props) => {
    const { className, children } = props

    return (
        <div data-test-boolean className={className} role="button" tabIndex={-1}>
            <img alt="hello, world!" key={1} src="./hello-world.png" />
            {children}
        </div>
    )
}

Component.propTypes = {
    className: PropTypes.string,
    children: PropTypes.element
}

Component.defaultProps = {
    className: undefined,
    children: null
}

export default Component
