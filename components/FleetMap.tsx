
import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { useData } from '../hooks/useData';
import { Vessel } from '../types';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const FleetMap: React.FC = () => {
    const { vessels, crew } = useData();
    const [activeVessel, setActiveVessel] = useState<Vessel | null>(null);

    const handleVesselClick = (vessel: Vessel) => {
        // If clicking the already active vessel, close the popup. Otherwise, open the new one.
        setActiveVessel(activeVessel?.id === vessel.id ? null : vessel);
    };

    const handleClosePopup = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveVessel(null);
    }

    return (
        <ComposableMap
            projectionConfig={{
                rotate: [-10, 0, 0],
                scale: 147
            }}
            style={{ width: "100%", height: "100%" }}
        >
            <Geographies geography={geoUrl}>
                {({ geographies }) =>
                    geographies.map(geo => (
                        <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill="#2d3748" // Corresponds to gray-800
                            stroke="#1e293b" // Corresponds to slate-800
                            style={{
                                default: { outline: "none" },
                                hover: { outline: "none" },
                                pressed: { outline: "none" },
                            }}
                        />
                    ))
                }
            </Geographies>
            {/* Vessel Markers */}
            {vessels.map(vessel => (
                <Marker
                    key={vessel.id}
                    coordinates={vessel.location}
                    onClick={() => handleVesselClick(vessel)}
                >
                    <g
                        fill={activeVessel?.id === vessel.id ? "#22d3ee" : "#f1f5f9"}
                        stroke={activeVessel?.id === vessel.id ? "#06b6d4" : "none"}
                        strokeWidth={2}
                        style={{ cursor: "pointer", transition: "fill 0.2s" }}
                    >
                        <circle r={6} className="hover:fill-primary-400" />
                    </g>
                </Marker>
            ))}
            {/* Active Vessel Popup (rendered as a separate marker) */}
            {activeVessel && (
                <Marker coordinates={activeVessel.location}>
                    {/* The entire popup is a group, shifted to appear above and to the left */}
                    <g transform="translate(-90, -155)">
                         {/* Connector line */}
                        <line x1="90" y1="155" x2="90" y2="125" stroke="#06b6d4" strokeWidth="2" />
                        {/* Background rect */}
                        <rect x="0" y="0" width="180" height="125" rx="8" fill="#1e293b" stroke="#334155" />
                        
                        {/* Vessel Name */}
                        <text x="10" y="20" fontSize="14" fontWeight="bold" fill="#f1f5f9">
                            {activeVessel.name}
                        </text>

                        {/* Close Button */}
                        <g onClick={handleClosePopup} style={{ cursor: 'pointer' }}>
                            <rect x="156" y="4" width="20" height="20" fill="transparent" />
                            <text x="162" y="19" fontSize="20" fill="#94a3b8">×</text>
                        </g>
                        
                        {/* IMO and Type */}
                        <text x="10" y="40" fontSize="12" fill="#94a3b8">
                           IMO: {activeVessel.imo}
                        </text>
                        <text x="10" y="55" fontSize="12" fill="#94a3b8">
                           Type: {activeVessel.type}
                        </text>

                        {/* Separator Line */}
                        <line x1="10" y1="65" x2="170" y2="65" stroke="#334155" strokeWidth="1" />
                        
                        {/* Crew Onboard Title */}
                        <text x="10" y="80" fontSize="12" fontWeight="semibold" fill="#f1f5f9">
                            Crew Onboard
                        </text>
                        
                        {/* Crew List */}
                        {crew.filter(c => c.vesselId === activeVessel.id).length > 0 ? (
                            crew.filter(c => c.vesselId === activeVessel.id).slice(0, 2).map((c, index) => (
                                <text key={c.id} x="10" y={95 + (index * 15)} fontSize="11" fill="#94a3b8">
                                    {c.name.length > 20 ? `${c.name.substring(0, 18)}...` : c.name}
                                </text>
                            ))
                        ) : (
                             <text x="10" y="95" fontSize="11" fill="#94a3b8">
                                No crew assigned.
                            </text>
                        )}
                    </g>
                </Marker>
            )}
        </ComposableMap>
    );
};

export default FleetMap;
