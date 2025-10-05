import { FC, useState } from "react"
import {
  ActivityIndicator,
  Image,
  ImageStyle,
  ScrollView,
  // eslint-disable-next-line no-restricted-imports
  TextInput,
  TextStyle,
  ViewStyle,
} from "react-native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAuth } from "@/context/AuthContext"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { playerInfoApi } from "@/services/api/playerInfoApi"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { useHeader } from "@/utils/useHeader"

interface PlayerInfoScreenProps extends AppStackScreenProps<"PlayerInfo"> {}

export const PlayerInfoScreen: FC<PlayerInfoScreenProps> = () => {
  const { themed, theme } = useAppTheme()
  const { logout, getAuthToken } = useAuth()
  const [player, setPlayer] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [playerId, setPlayerId] = useState<string>("4")

  useHeader(
    {
      title: "Игрок",
      rightTx: "common:logOut",
      onRightPress: logout,
    },
    [logout],
  )

  const loadInfo = async () => {
    if (!playerId) return
    setLoading(true)
    try {
      const token = getAuthToken()
      const data = await playerInfoApi(Number(playerId), token)
      setPlayer(data)
    } catch (err) {
      console.error(err)
      setPlayer(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen preset="fixed" contentContainerStyle={themed($screen)}>
      <ScrollView contentContainerStyle={themed($scroll)}>
        {/* Поле для ввода ID игрока */}
        <TextInput
          value={playerId}
          onChangeText={setPlayerId}
          placeholder="Введите ID игрока"
          keyboardType="numeric"
          style={themed($input)}
        />

        <Button text="Загрузить" onPress={loadInfo} style={themed($loadButton)} />

        {loading && (
          <ActivityIndicator
            size="large"
            color={theme.colors.tint}
            style={themed($loadingIndicator)}
          />
        )}

        {!loading && player && (
          <>
            {player.avatar_url && (
              <Image
                source={{ uri: player.avatar_url }}
                style={themed($avatar)}
                resizeMode="cover"
              />
            )}

            <Text preset="heading" text={player.name} style={themed($name)} />
            <Text text={`Рейтинг: ${player.filled_rating}`} style={themed($info)} />
            <Text text={`Пол: ${player.gender}`} style={themed($info)} />

            {player.coordinates?.city && (
              <Text text={`Город: ${player.coordinates.city}`} style={themed($info)} />
            )}
          </>
        )}
      </ScrollView>
    </Screen>
  )
}

const $screen: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flex: 1,
  padding: spacing.lg,
  backgroundColor: colors.background,
})

const $scroll: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  paddingVertical: spacing.xl,
})

const $avatar: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  width: 120,
  height: 120,
  borderRadius: 60,
  marginBottom: spacing.md,
})

const $name: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $info: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $input: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  borderWidth: 1,
  borderColor: colors.tint,
  borderRadius: 8,
  padding: spacing.md,
  width: "100%",
  marginBottom: spacing.md,
  color: colors.text,
})

const $loadButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
  alignSelf: "stretch",
})
const $loadingIndicator: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.lg, // вместо 20 используем spacing
})
