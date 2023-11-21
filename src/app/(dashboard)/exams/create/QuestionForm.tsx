import Input from "@/components/InputComponent";
import TextArea from "@/components/TextArea";
import { Grid, Paper, styled, Typography, Box, Chip, FormControlLabel, Radio, Button, RadioGroup, IconButton } from "@mui/material";
import moment from "moment";
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { axiosInstance } from "@/utils/axiosInstance";
import { toastMessage } from "@/utils/toastify";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import DeleteIcon from '@mui/icons-material/Delete';

const Title = styled(Typography)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 4,
    background: "#E7F0FF",
    padding: "5px 7px",
    color: theme.palette.primary.main
}))

const ItemWrapper: any = styled(Typography)(({ theme }: any) => ({
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 2
}))

const StyledButton = styled(Button)(() => ({
    width: "180px"
}))

const FormButton = styled(Button)(() => ({
    width: "100px"
}))

const validationSchema = Yup.object({
    question: Yup.string().required('This field is required'),
    correctAnswer: Yup.string().required('This field is required'),
    options: Yup.array().of(
        Yup.object().shape({
            option: Yup.string().required('This field is required'),

        })
    ),
});


export default function QuestionForm({ assignment }: any) {
    const [isLoading, setIsLoading] = useState(false)
    const [questions, setQuestions] = useState([{}])
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
    const router = useRouter();

    const {
        reset,
        control,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onNext = (data: any) => {
        questions[activeQuestionIndex] = data;
        setQuestions(questions)
        setActiveQuestionIndex(activeQuestionIndex + 1);
        reset()
    }

    const onPrevious = () => {
        setActiveQuestionIndex(activeQuestionIndex - 1);
    }

    useEffect(() => {
        const question: any = questions[activeQuestionIndex] ?? {};
        setValue("question", question?.question ?? "")
        setValue("correctAnswer", question?.correctAnswer ?? 0)
        question?.options && question?.options.forEach((item: any, index: number) => {
            setValue(`options[${index}].option` as any, item?.option ?? "");
            return item;
        })

    }, [activeQuestionIndex, questions])

    const onSubmit = (data: any) => {
        const _questions = questions;
        _questions[activeQuestionIndex] = data;

        const payload = {
            ...assignment,
            startDate: moment(assignment?.startDate).format("YYYY-MM-DD"),
            endDate: moment(assignment?.endDate).format("YYYY-MM-DD"),
            questions: _questions.map((item: any) => {
                item.options = item?.options && item.options.map((option: any, index: any) => {
                    option.isCorrect = (index + 1) === option.correctAnswer;
                    return option;
                })

                return item;
            })
        }
        setIsLoading(true)
        axiosInstance.post("/api/institute/exam/create", payload).then((res) => {
            toastMessage(res.data.message, "s")
            router.push('/exams');
        }).catch((error) => {
            setIsLoading(false)
        })
    }

    const deleteQuestion = (indexToRemove: number) => {
        let newArray = questions.filter((_, index) => index !== indexToRemove);
        setQuestions(newArray)
    }

    return (
        <>

            <Paper elevation={0} sx={{ height: "100%" }}>
                <Paper elevation={2}>
                    <Title variant="subtitle1" >
                        <span></span>
                        <span>Maths</span>
                        <IconButton
                            color="error"
                            size="small"
                            disabled={questions.length === 1}
                            onClick={() => deleteQuestion(activeQuestionIndex)}
                        ><DeleteIcon /></IconButton>
                    </Title>
                    <Box component="div" >
                        <Grid container spacing={2} sx={{ p: 1 }} alignItems={"center"}>
                            <Grid item sm={3} md={2}>
                                <Chip label={`Question ${activeQuestionIndex.toString().length >= 9 ? activeQuestionIndex : ("0" + (activeQuestionIndex + 1))}`} sx={{ borderRadius: 0 }} />
                            </Grid>
                            <Grid item sm={4} md={2}>
                                <ItemWrapper component="div" >
                                    <Typography variant="subtitle2" >Assignment: </Typography>
                                    <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>{assignment.examType === 1 ? "Objective" : "Subjective"}</Typography>
                                </ItemWrapper>
                            </Grid>
                            <Grid item sm={4} md={4}>
                                <ItemWrapper component="div" >
                                    <Typography variant="subtitle2" >Date: </Typography>
                                    <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>{moment().format("DD MMM YYYY")}</Typography>
                                </ItemWrapper>
                            </Grid>
                            <Grid item sm={4} md={2}>
                                <ItemWrapper component="div" >
                                    <Typography variant="subtitle2" >Question: </Typography>
                                    <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>{questions.length}</Typography>
                                </ItemWrapper>
                            </Grid>
                            <Grid item sm={4} md={2}>
                                <ItemWrapper component="div" >
                                    <Typography variant="subtitle2" >Total marks: </Typography>
                                    <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>{assignment.totalMarks}</Typography>
                                </ItemWrapper>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>

                <Box component="div" maxWidth={"md"} sx={{ p: 4 }} >
                    <Controller
                        name="question"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextArea
                                {...field}
                                margin="normal"
                                required
                                fullWidth
                                label="Description"
                                error={!!errors.question}
                                helperText={errors.question?.message}
                                multiline
                                rows={2}
                            />
                        )}
                    />
                    {[1, 2, 3, 4].map((item, index) => (
                        <ItemWrapper component="div" key={item} sx={{ mt: 2 }}>
                            <Typography >{item}.</Typography>
                            <Controller
                                name={`correctAnswer`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <>
                                        <Radio
                                            checked={parseInt(field.value) === item}
                                            size="small"
                                            {...field}
                                            value={item}
                                        />
                                    </>
                                )}
                            />

                            <Controller
                                name={`options[${index}].option` as any}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <>
                                        <Input
                                            {...field}
                                            size="small"
                                            required
                                            fullWidth
                                            label=""
                                            error={!!errors.options?.[index]?.option}
                                        />
                                    </>
                                )}
                            />
                        </ItemWrapper>
                    ))}
                </Box>
                <Box component="div" sx={{ display: "flex", justifyContent: "space-around", mt: 3 }}>
                    <Box component="div" sx={{ display: "flex", justifyContent: "flex-start", gap: 6 }}>
                        <FormButton size="small" variant="outlined" disabled={activeQuestionIndex === 0} onClick={onPrevious}>Previous</FormButton>
                        <FormButton size="small" variant="contained" onClick={handleSubmit(onNext)}>Next</FormButton>
                    </Box>
                    <Box component="div" sx={{ display: "flex", justifyContent: "flex-start", gap: 6 }}>
                        <StyledButton size="small" variant="contained" color="error" LinkComponent={Link} href="/assignment">Cancel Assignment</StyledButton>
                        <StyledButton size="small" variant="contained" color="success" onClick={handleSubmit(onSubmit)}>{isLoading ? "Loading..." : "Submit Assignment"}</StyledButton>
                    </Box>
                </Box>
            </Paper>

        </>
    )
}