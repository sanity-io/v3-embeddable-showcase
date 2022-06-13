import { Card, Stack, Text, Avatar, Inline, Flex, Button } from '@sanity/ui'
import { AddIcon, PublishIcon, EditIcon } from '@sanity/icons'

export default function ThemePreview() {
  return (
    <Stack>
      <Card padding={4}>
        <Stack space={[3, 3, 4]}>
          <Card padding={[3, 3, 4]} radius={2} shadow={1}>
            <Text align="center" size={[2, 2, 3]}>
              Text in a card with <a href="#">link</a>
            </Text>
          </Card>

          <Card padding={[3, 3, 4]} radius={2} shadow={1} tone="primary">
            <Text align="center" size={[2, 2, 3]}>
              Text in a card with <a href="#">link</a>
            </Text>
          </Card>

          <Card padding={[3, 3, 4]} radius={2} shadow={1} tone="positive">
            <Text align="center" size={[2, 2, 3]}>
              Text in a card with <a href="#">link</a>
            </Text>
          </Card>

          <Card padding={[3, 3, 4]} radius={2} shadow={1} tone="caution">
            <Text align="center" size={[2, 2, 3]}>
              Text in a card with <a href="#">link</a>
            </Text>
          </Card>

          <Card padding={[3, 3, 4]} radius={2} shadow={1} tone="critical">
            <Text align="center" size={[2, 2, 3]}>
              Text in a card with <a href="#">link</a>
            </Text>
          </Card>
        </Stack>
      </Card>
      <Card padding={4} style={{ textAlign: 'center' }}>
        <Inline space={[3, 3, 4]}>
          <Button
            fontSize={[2, 2, 3]}
            icon={EditIcon}
            mode="bleed"
            padding={[3, 3, 4]}
            text="Edit"
          />
          <Button
            fontSize={[2, 2, 3]}
            icon={AddIcon}
            mode="ghost"
            padding={[3, 3, 4]}
            text="Create"
          />
          <Button
            fontSize={[2, 2, 3]}
            icon={PublishIcon}
            padding={[3, 3, 4]}
            text="Publish"
            tone="primary"
          />
        </Inline>
      </Card>
    </Stack>
  )
}
