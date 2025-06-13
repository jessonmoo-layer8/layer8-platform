package layer8.compliance

default allow = false

allow {
    input.taskMeta.app == "Gmail"
    input.userContext.role == "user"
    input.steps[_].action == "reset_password"
}

# ServiceNow ticket creation allowed for it_admin role
allow {
    input.taskMeta.app == "ServiceNow"
    input.userContext.role == "it_admin"
    input.steps[_].action == "create_ticket"
}

# Slack messaging allowed for communications role
allow {
    input.taskMeta.app == "Slack"
    input.userContext.role == "communications"
    input.steps[_].action == "send_message"
}

# HIPAA example: only compliance officers may access patient records
allow {
    input.taskMeta.app == "PatientPortal"
    input.userContext.role == "compliance_officer"
    input.steps[_].action == "view_record"
}

deny[msg] {
    not allow
    msg := "Task does not meet Layer 8 compliance requirements."
}

scorecard := {
    "compliance": allow,
    "reason": cond_reason
}

cond_reason = msg {
    not allow
    msg := "Non-compliant: only users with role 'user' may reset Gmail passwords."
}

cond_reason = "Compliant" {
    allow
}
