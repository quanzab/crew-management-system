
import { useAuth } from './useAuth';
import { User } from '../types';

type Role = User['role'];

const defaultPermissions = {
    // Page access
    canAccessSettings: false,
    canAccessAuditTrail: false,
    canAccessAIPlanner: false,
    canAccessAIHRAssistant: false,
    canAccessBilling: false,
    canAccessPrincipals: false,
    canAccessPayroll: false,
    canAccessVessels: false,
    canAccessCrew: false,
    canAccessJobs: false,
    canAccessAppraisals: false,
    canAccessSurveyor: false,
    canAccessCompliance: false,
    canAccessReports: false,
    // Action permissions
    canAddVessel: false,
    canEditVessel: false,
    canDeleteVessel: false,
    canAddPrincipal: false,
    canEditPrincipal: false,
    canDeletePrincipal: false,
    canAddCrew: false,
    canEditCrew: false,
    canDeleteCrew: false,
    canAddJob: false,
    canEditJob: false,
    canAddAppraisal: false,
    canSubmitSurveyorFinding: false,
    canCreateInvoice: false,
    canLoginAsCrew: false,
};


export const usePermissions = () => {
    const { authenticatedUser } = useAuth();
    const role: Role | undefined = authenticatedUser?.role;

    // Default to least privilege if no role is found
    if (!role) {
        return defaultPermissions;
    }

    const isAdmin = role === 'admin';
    const isManager = role === 'manager';
    const isCrewingOfficer = role === 'crewing_officer';

    const permissions = {
        // Page access checks
        canAccessSettings: isAdmin,
        canAccessAuditTrail: isAdmin,
        canAccessAIPlanner: isAdmin,
        canAccessAIHRAssistant: isAdmin,
        canAccessBilling: isAdmin || isManager,
        canAccessPrincipals: isAdmin || isManager,
        canAccessPayroll: isAdmin || isManager,
        canAccessVessels: isAdmin || isManager || isCrewingOfficer,
        canAccessCrew: isAdmin || isManager || isCrewingOfficer,
        canAccessJobs: isAdmin || isManager || isCrewingOfficer,
        canAccessAppraisals: isAdmin || isManager || isCrewingOfficer,
        canAccessSurveyor: isAdmin || isManager,
        canAccessCompliance: isAdmin || isManager,
        canAccessReports: isAdmin || isManager,

        // Action-level checks
        canAddVessel: isAdmin || isManager,
        canEditVessel: isAdmin || isManager,
        canDeleteVessel: isAdmin,
        
        canAddPrincipal: isAdmin || isManager,
        canEditPrincipal: isAdmin || isManager,
        canDeletePrincipal: isAdmin,

        canAddCrew: isAdmin || isManager || isCrewingOfficer,
        canEditCrew: isAdmin || isManager || isCrewingOfficer,
        canDeleteCrew: isAdmin || isManager,

        canAddJob: isAdmin || isManager || isCrewingOfficer,
        canEditJob: isAdmin || isManager || isCrewingOfficer,

        canAddAppraisal: isAdmin || isManager || isCrewingOfficer,
        
        canSubmitSurveyorFinding: isAdmin || isManager,

        canCreateInvoice: isAdmin || isManager,
        
        canLoginAsCrew: isAdmin,
    };

    return permissions;
};
