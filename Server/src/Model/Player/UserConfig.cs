using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Model.Model.Player;

namespace Model.Config.Player;

public class UserConfig : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("User");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Uid)
        .IsRequired()
        .HasMaxLength(8);

        builder.Property(e => e.UserName)
        .IsRequired()
        .HasMaxLength(16);

        builder.Property(e => e.Password)
        .IsRequired()
        .HasMaxLength(256);

        builder.Property(e => e.Email)
        .IsRequired()
        .HasMaxLength(50);

        builder.Property(e => e.LastLoginTime)
        .IsRequired()
        .HasColumnType("datetime");

        builder.Property(e => e.RegisterTime)
        .IsRequired()
        .HasColumnType("datetime");

    }
}