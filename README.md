deploirement

ionic build
ionic cap add android
ionic cap sync android
ionic cap open android

generate logo and splash
npx capacitor-resources --android

MEP
ionic build --prod

ionic cap sync android
ionic cap sync ios

ionic cap open ios
