import Input from "./InputComponent";

export default function TextArea({ field, ...rest }: any) {
    return (
        <>
            <Input
                {...field}

                inputSx={{
                    border: 'none',
                    padding: 0,
                }}
                {...rest}
            />
        </>
    )
}