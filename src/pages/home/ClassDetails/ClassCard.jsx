import {ChevronRight} from "lucide-react";
import "./ClassDetails.css";

export default function ClassCard({ onOpenGenerate }) {
    return (
        <div className="class-card-container">
            <div className="class-header-small">Join Code: QR4SF5</div>
            <div className="class-header-big">
                Dr. Sean's AP Calculus BC Class
                <br/>
                Fall 2026
            </div>
            <button className="generate-button" onClick={onOpenGenerate} type="button">
                <div>Generate Plans</div>
                <div className="generate-button-circle">
                    <ChevronRight size={32} />
                </div>
            </button>
        </div>
    )
}
