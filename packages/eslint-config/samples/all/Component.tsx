import React from "react"
import Image from "./Image"

export interface ComponentProps {
    children?: React.ReactNode
    className?: string
}

const Component: React.FunctionComponent<ComponentProps> = (props) => {
    const { className, children } = props

    return (
        <div data-test-boolean className={className}>
            <Image alt="hello-world" key={1} src="./hello-world.png" />
            {children}
        </div>
    )
}

Component.defaultProps = {
    children: null,
    className: undefined
}

export default Component
