variable "aws_region" {
  description = "AWS region where Savorly is deployed"
  type        = string
  default     = "eu-north-1"
}

variable "instance_ami" {
  description = "AMI used by the Savorly EC2 instance"
  type        = string
  default     = "ami-0aba19e56f3eaec05"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}