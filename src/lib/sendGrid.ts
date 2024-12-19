import sgMail from '@sendgrid/mail'

export const sendEmail = async (to:string,subject:string,text:string)=>{
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

    const msg={
        to,
        from:'mymaildevelopers1@gmail.com',
        subject,
        text
    }

    try {
        await sgMail.send(msg)
        console.log(`Email Sent to ${to}`)
    } catch (error) {
        console.log(error)
    }
}