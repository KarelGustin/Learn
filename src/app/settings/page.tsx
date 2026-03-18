import { getUserSettings } from "@/services/journal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Database } from "lucide-react"
import { SettingsForm } from "@/components/settings/settings-form"

export default async function SettingsPage() {
  const settings = await getUserSettings()

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-50 flex items-center gap-3">
          <Settings className="h-8 w-8 text-zinc-400" />
          Settings
        </h1>
        <p className="text-zinc-400 mt-1">Configure your learning preferences</p>
      </div>

      <SettingsForm settings={settings} />

      {/* Database Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-4 w-4 text-zinc-500" />
            Database
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-zinc-400 space-y-1">
            <p>Database: SQLite (local file)</p>
            <p>Location: prisma/learn.db</p>
            <p className="text-xs text-zinc-600 mt-2">
              Your entire learning history is stored locally. Back up by copying the learn.db file.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
