import {ChevronRight} from "lucide-react";
import "./ClassDetails.css";

export default function ClassCard() {
    return (
        <div className="class-card-container">
            <div className="class-header-small">Join Code: QR4SF5</div>
            <div className="class-header-big">
                Dr. Combs' AP Calculus BC Class
                <br/>
                Fall 2026
            </div>
            <button className = "generate-button">
                <div>Generate Plans</div>
                <div className = "generate-button-circle">
                    <ChevronRight size={32} />
                </div>
            </button>
        </div>
    )
}
