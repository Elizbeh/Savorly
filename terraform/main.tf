terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  required_version = ">= 1.5.0"

  backend "s3" {
    bucket = "savorly-terraform-state-elizbeh"
    key    = "savorly/terraform.tfstate"
    region = "eu-north-1"
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_instance" "savorly" {
  ami           = var.instance_ami
  instance_type = var.instance_type

  availability_zone = "eu-north-1c"
  subnet_id         = "subnet-0d9bd588f65e85ebf"
  key_name          = "devops-lab-key"

  tags = {
    Name = "devops-lab"
  }
}

resource "aws_security_group" "savorly" {
  name        = "Devops-lab-security-group"
  description = "Allow ssh access to host"
  vpc_id      = "vpc-080e15f9b044b43ce"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "Devops-lab-security-group"
  }
}
