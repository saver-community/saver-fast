import { extendTheme } from '@chakra-ui/react'
import { ButtonStyles as Button, CardsStyles as Container, ProgressStyles as Progress } from './buttonStyles';

const colors = {
    bgDark:  '#1A202C',
    bgLight: '#FFFFFF'
}
const components = { Button, Container, Progress };
const values = { colors, components };

export const theme = extendTheme(values);