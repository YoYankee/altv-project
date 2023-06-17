using AltV.Net;
using AltV.Net.Data;
using AltV.Net.Elements.Entities;
using MainResource.Log;
using Microsoft.Extensions.DependencyInjection;
using src.Factory.TPlayer;
using src.Repository.IRepository;

namespace src.Event;

public class Connect : IScript
{
    private readonly IUserRepository UserRepository;

    public Connect( IUserRepository userRepository )
    {
        UserRepository = userRepository;
    }

    public Connect()
    {
        UserRepository = Server.serviceProvider.GetService<IUserRepository>();
    }

    [ScriptEvent(ScriptEventType.PlayerConnect)]
    public void OnPlayerConnect( IPlayer player, string reason )
    {
        Logger.Info("[连接] " + player.Name + " 连接了服务器");
        player.Emit("TestClientside", player.Name);
        player.Emit("auth:client:show");
    }

    [ClientEvent("auth:server:tryLogin")]
    public void TryLogin(TPlayer player, string username, string password)
    {
        if (!UserRepository.IsUserExist(username))
        {
            player.Emit("auth:client:wrongAuth");
            return;
        }

        if (UserRepository.CheckPassword(username, password))
        {
            UserRepository.UserLogin(player, username);
        }
    }

    [ClientEvent("auth:server:tryRegister")]
    public void TryRegister(TPlayer player, string username, string password, string email)
    {
        if (UserRepository.Register(player, username, password, email))
        {
            player.Emit("auth:client:alreadyExist");
        }
    }
}