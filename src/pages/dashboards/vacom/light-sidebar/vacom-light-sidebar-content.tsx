import {
  VcChannelStats,
  VcEarningsChart,
  VcEntryCallout,
  VcHighlights,
  VcTeamMeeting,
  VcTeams,
} from './components';

export function VacomLightSidebarContent() {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="grid lg:grid-cols-3 gap-y-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-1">
          <div className="grid grid-cols-2 gap-5 lg:gap-7.5 h-full items-stretch">
            <VcChannelStats />
          </div>
        </div>
        <div className="lg:col-span-2">
          <VcEntryCallout className="h-full" />
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-1">
          <VcHighlights limit={3} />
        </div>
        <div className="lg:col-span-2">
          <VcEarningsChart />
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-1">
          <VcTeamMeeting />
        </div>
        <div className="lg:col-span-2">
          <VcTeams />
        </div>
      </div>
    </div>
  );
}
