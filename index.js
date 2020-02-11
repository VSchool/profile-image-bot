require("dotenv").config()
const { createEventAdapter } = require("@slack/events-api")
const { WebClient } = require("@slack/web-api")

const web = new WebClient(process.env.SLACK_TOKEN)
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET)
const port = process.env.PORT || 3001

slackEvents.on("message", event => {
    if (event.user && event.user !== "UT7PHTKUK") {
        web.users.profile
            .get({ user: event.user })
            .then(res => {
                console.log(res.profile.image_24.includes("d=https"))
                if(res.profile.image_24.includes("d=https")) {
                    return web.chat.postEphemeral({
                        channel: event.channel,
                        user: event.user,
                        text: "It looks like you may not have set a profile image yet. Please update your profile to include a recognizable image.\n\nOn the desktop Slack client, click V School in the upper-left -> Profile & Account -> Edit Profile -> Upload an image\n\n(It's possible your image IS there but is coming from Gravatar. If that's the case, and you are recognizable from your image, you can ignore this message.)"
                    })
                }
            })
    }
})

slackEvents.on("error", console.error)

slackEvents.start(port).then(() => {
    // Listening on path '/slack/events' by default
    console.log(`server listening on port ${port}`)
})
