output "instance_id" {
  description = "Savorly EC2 instance ID"
  value       = aws_instance.savorly.id
}

output "public_ip" {
  description = "Savorly EC2 public IP address"
  value       = aws_instance.savorly.public_ip
}

output "security_group_id" {
  description = "Savorly security group ID"
  value       = aws_security_group.savorly.id
}