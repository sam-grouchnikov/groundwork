import { BellDot, Search } from 'lucide-react';
import profileMememoji from '../../../assets/ProfileMememoji.svg';
import './TopRow.css';

export default function TopRow({ profileName = 'Sean Sean' }) {
  return (
    <header className="top-row" aria-label="Home toolbar">
      <label className="top-row-search">
        <Search size={20} aria-hidden="true" />
        <span className="top-row-search-label">Search</span>
        <input type="search" placeholder="Search Anything" />
      </label>

      <div className="top-row-actions">
        <span className="top-row-divider" aria-hidden="true" />

        <button className="top-row-icon-button" type="button" aria-label="Notifications" title="Notifications">
          <BellDot size={20} aria-hidden="true" />
        </button>

        <span className="top-row-avatar" aria-hidden="true">
          <img src={profileMememoji} alt="" />
        </span>

        <span className="top-row-profile-name">{profileName}</span>
      </div>
    </header>
  );
}
