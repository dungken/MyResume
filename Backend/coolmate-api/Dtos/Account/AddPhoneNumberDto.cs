using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Account
{
    public class AddPhoneNumberDto
    {
        [Required]
        public string PhoneNumber { get; set; }
    }
}